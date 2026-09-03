import asyncio
import time
import structlog
from heapq import heappush, heappop
from typing import List, Dict, Set
from app.core.celery_app import celery_app, async_to_sync
from app.db.neo4j_client import neo4j_client
from app.services.ml_engine import evaluate_node

logger = structlog.get_logger()

KNOWN_HOT_WALLETS = {
    "0x28c6c06298d514db089934071355e22af16ababf": "Binance 14",
    "0xdfd5293d8e347dfe59e90efd55b2956a1343963d": "Binance 15",
}

async def fetch_transactions(address: str, chain: str) -> List[Dict]:
    """Mock RPC fetch"""
    await asyncio.sleep(0.5)
    return [
        {
            "hash": f"0xmocktx1_{address[:8]}",
            "from": address,
            "to": "0xintermediary1",
            "value": 1.5,
            "isError": "0",
            "timeStamp": int(time.time()),
        },
        {
            "hash": f"0xmocktx2_{address[:8]}",
            "from": address,
            "to": "0xchangeaddress",
            "value": 15.0,
            "isError": "0",
            "timeStamp": int(time.time()),
        }
    ]

def detect_peel_chain(transactions: List[Dict], source_address: str):
    outgoing = [tx for tx in transactions if tx["from"].lower() == source_address.lower()]
    if len(outgoing) == 2:
        outgoing.sort(key=lambda x: float(x["value"]), reverse=True)
        return outgoing[1]["to"] # The smaller one is the peel/hop
    return None

async def process_trace(start_address: str, max_hops: int = 4, min_value_threshold: float = 0.01, chain: str = "ETH"):
    await neo4j_client.connect()
    
    # Priority queue stores tuples: (-value, current_hop, current_address, path_history)
    # Using negative value because heapq is a min-heap, we want max value first (greedy)
    priority_queue = []
    heappush(priority_queue, (-float('inf'), 0, start_address.lower(), []))
    
    visited: Set[str] = set()
    identified_vasp_paths = []
    
    logger.info("Starting greedy graph traversal", start_address=start_address)

    while priority_queue:
        neg_val, hop, current_addr, path = heappop(priority_queue)
        current_val = -neg_val

        if current_addr in visited or hop >= max_hops:
            continue
            
        visited.add(current_addr)

        # 1. Check known VASP database
        if current_addr in KNOWN_HOT_WALLETS:
            vasp_name = KNOWN_HOT_WALLETS[current_addr]
            logger.info("Terminal known VASP reached", vasp=vasp_name, address=current_addr)
            identified_vasp_paths.append({
                "vasp": vasp_name,
                "terminal_address": current_addr,
                "hops": hop,
                "total_path": path + [current_addr]
            })
            break  # Nearest VASP reached on this flow branch

        # 2. Fetch outgoing transactions
        txs = await fetch_transactions(current_addr, chain)
        valid_txs = [
            tx for tx in txs 
            if tx.get("isError") != "1" and float(tx.get("value", 0)) >= min_value_threshold
        ]

        # 3. Detect Peel Chain (1 change address + 1 outbound hop)
        if len(valid_txs) == 2:
            # Flag the peel pattern to prioritize the cash-out branch
            valid_txs.sort(key=lambda x: float(x["value"]), reverse=True)
            logger.info("Peel chain detected", source=current_addr)

        for tx in valid_txs:
            destination = tx["to"].lower()
            tx_value = float(tx["value"])
            
            # Ingest into Neo4j
            await neo4j_client.ingest_transaction(
                tx_hash=tx["hash"],
                from_address=current_addr,
                to_address=destination,
                value=tx_value,
                timestamp=int(tx["timeStamp"])
            )
            
            # Check ML VASP classification if destination exhibits exchange behavior
            is_cex, vasp_name, confidence = await evaluate_node(destination, valid_txs, hop + 1)
            if is_cex:
                logger.info("ML identified CEX", address=destination, confidence=confidence)
                identified_vasp_paths.append({
                    "vasp": vasp_name or "Identified Centralized Exchange",
                    "terminal_address": destination,
                    "hops": hop + 1,
                    "total_path": path + [current_addr, destination],
                    "settling_tx": tx["hash"]
                })
                break

            if destination not in visited:
                heappush(
                    priority_queue, 
                    (-tx_value, hop + 1, destination, path + [current_addr])
                )
                
        if identified_vasp_paths:
            break

    await neo4j_client.close()
    logger.info("Graph traversal complete")
    return identified_vasp_paths

@celery_app.task(name="tasks.trace_suspect_wallet_task")
def trace_suspect_wallet_task(suspect_address: str, max_hops: int = 4, min_value_threshold: float = 0.01, chain: str = "ETH"):
    logger.info("Celery trace task started", suspect_address=suspect_address)
    result = async_to_sync(process_trace(suspect_address, max_hops, min_value_threshold, chain))
    return {"status": "completed", "address": suspect_address, "identified_vasps": result}
