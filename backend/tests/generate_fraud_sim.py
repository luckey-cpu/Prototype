import os
import argparse
import random
import time
import uuid
import pandas as pd
import networkx as nx

def generate_random_address():
    return "0x" + "".join(random.choices("0123456789abcdef", k=40))

def generate_noise(G: nx.MultiDiGraph, num_nodes: int):
    """Inject background airdrop / DEX swap noise."""
    for _ in range(num_nodes):
        src = generate_random_address()
        dst = generate_random_address()
        G.add_node(src, initial_balance=random.uniform(0.1, 5.0), is_contract=False, cluster_role='noise')
        G.add_node(dst, initial_balance=random.uniform(0.0, 1.0), is_contract=random.choice([True, False]), cluster_role='noise')
        
        G.add_edge(
            src, dst,
            tx_hash="0x" + uuid.uuid4().hex,
            block_number=random.randint(10000000, 15000000),
            timestamp=int(time.time()) - random.randint(0, 86400 * 30),
            value_eth=random.uniform(0.01, 2.0),
            gas_used=random.randint(21000, 100000),
            is_error=0
        )

def generate_peel_chain(G: nx.MultiDiGraph, amount: float = 100.0, length: int = 8):
    victim = generate_random_address()
    G.add_node(victim, initial_balance=amount, is_contract=False, cluster_role='victim')
    
    current_wallet = generate_random_address()
    G.add_node(current_wallet, initial_balance=0.0, is_contract=False, cluster_role='suspect_root')
    
    # Theft edge
    t_start = int(time.time()) - 86400 * 7
    blk = 12000000
    G.add_edge(victim, current_wallet, tx_hash="0x"+uuid.uuid4().hex, block_number=blk, timestamp=t_start, value_eth=amount, gas_used=21000, is_error=0)
    
    current_amount = amount
    for i in range(length):
        peel_amount = current_amount * random.uniform(0.05, 0.10)
        change_amount = current_amount - peel_amount - 0.001 # fee
        
        sink_wallet = generate_random_address()
        next_wallet = generate_random_address()
        
        # Last hop goes to VASP
        role_sink = 'mule' if i < length - 1 else 'vasp_deposit'
        G.add_node(sink_wallet, initial_balance=0.0, is_contract=False, cluster_role=role_sink)
        G.add_node(next_wallet, initial_balance=0.0, is_contract=False, cluster_role='peel_change')
        
        t_start += random.randint(300, 3600)
        blk += random.randint(10, 100)
        
        # Peel edge
        G.add_edge(current_wallet, sink_wallet, tx_hash="0x"+uuid.uuid4().hex, block_number=blk, timestamp=t_start, value_eth=peel_amount, gas_used=21000, is_error=0)
        # Change edge
        G.add_edge(current_wallet, next_wallet, tx_hash="0x"+uuid.uuid4().hex, block_number=blk+1, timestamp=t_start+15, value_eth=change_amount, gas_used=21000, is_error=0)
        
        current_wallet = next_wallet
        current_amount = change_amount

def generate_smurfing(G: nx.MultiDiGraph, amount: float = 50.0):
    victim = generate_random_address()
    root = generate_random_address()
    G.add_node(victim, initial_balance=amount, is_contract=False, cluster_role='victim')
    G.add_node(root, initial_balance=0.0, is_contract=False, cluster_role='suspect_root')
    
    t_base = int(time.time()) - 86400 * 3
    G.add_edge(victim, root, tx_hash="0x"+uuid.uuid4().hex, block_number=13000000, timestamp=t_base, value_eth=amount, gas_used=21000, is_error=0)
    
    # 12 mules
    mules = [generate_random_address() for _ in range(12)]
    for m in mules:
        G.add_node(m, initial_balance=0.0, is_contract=False, cluster_role='mule')
        G.add_edge(root, m, tx_hash="0x"+uuid.uuid4().hex, block_number=13000000+random.randint(1,5), 
                   timestamp=t_base+random.randint(30, 600), value_eth=(amount/12)-0.001, gas_used=21000, is_error=0)
                   
    # Aggregation
    agg_wallet = generate_random_address()
    G.add_node(agg_wallet, initial_balance=0.0, is_contract=False, cluster_role='vasp_deposit')
    
    for m in mules:
        t_agg = t_base + random.randint(1800, 14400) # 30 mins to 4 hours
        G.add_edge(m, agg_wallet, tx_hash="0x"+uuid.uuid4().hex, block_number=13000500, 
                   timestamp=t_agg, value_eth=(amount/12)-0.002, gas_used=21000, is_error=0)

def generate_mixer_loop(G: nx.MultiDiGraph, amount: float = 100.0):
    victim = generate_random_address()
    intermediary = generate_random_address()
    mixer = generate_random_address()
    
    G.add_node(victim, initial_balance=amount, is_contract=False, cluster_role='victim')
    G.add_node(intermediary, initial_balance=0.0, is_contract=False, cluster_role='suspect_root')
    G.add_node(mixer, initial_balance=1000.0, is_contract=True, cluster_role='mixer')
    
    t = int(time.time()) - 86400 * 10
    blk = 14000000
    G.add_edge(victim, intermediary, tx_hash="0x"+uuid.uuid4().hex, block_number=blk, timestamp=t, value_eth=amount, gas_used=21000, is_error=0)
    G.add_edge(intermediary, mixer, tx_hash="0x"+uuid.uuid4().hex, block_number=blk+10, timestamp=t+150, value_eth=amount-0.01, gas_used=150000, is_error=0)
    
    # Uncorrelated withdrawals
    for _ in range(3):
        fresh = generate_random_address()
        G.add_node(fresh, initial_balance=0.0, is_contract=False, cluster_role='mule')
        G.add_edge(mixer, fresh, tx_hash="0x"+uuid.uuid4().hex, block_number=blk+random.randint(1000, 5000), 
                   timestamp=t+random.randint(86400, 86400*3), value_eth=(amount-0.01)/3, gas_used=50000, is_error=0)

def main():
    parser = argparse.ArgumentParser(description="Synthetic Blockchain Laundering Generator")
    parser.add_argument("--num_cases", type=int, default=50, help="Number of laundering cases to simulate")
    parser.add_argument("--noise_ratio", type=float, default=0.2, help="Ratio of noise nodes relative to signal nodes")
    args = parser.parse_args()

    G = nx.MultiDiGraph()
    
    print(f"[*] Generating {args.num_cases} synthetic laundering topologies...")
    
    for i in range(args.num_cases):
        topo_type = random.choice(["peel", "smurf", "mixer"])
        if topo_type == "peel":
            generate_peel_chain(G, amount=random.uniform(10.0, 500.0))
        elif topo_type == "smurf":
            generate_smurfing(G, amount=random.uniform(20.0, 100.0))
        elif topo_type == "mixer":
            generate_mixer_loop(G, amount=random.uniform(50.0, 1000.0))
            
    num_signal = G.number_of_nodes()
    num_noise = int(num_signal * args.noise_ratio)
    print(f"[*] Injecting {num_noise} background noise edges...")
    generate_noise(G, num_noise)
    
    print(f"[+] Total Nodes: {G.number_of_nodes()} | Total Edges: {G.number_of_edges()}")
    
    # Export to DataFrames
    nodes_data = []
    for node, data in G.nodes(data=True):
        nodes_data.append({
            "address": node,
            "initial_balance": data.get("initial_balance", 0.0),
            "is_contract": data.get("is_contract", False),
            "cluster_role": data.get("cluster_role", "unknown")
        })
        
    edges_data = []
    for u, v, data in G.edges(data=True):
        edges_data.append({
            "from_address": u,
            "to_address": v,
            "tx_hash": data.get("tx_hash", ""),
            "block_number": data.get("block_number", 0),
            "timestamp": data.get("timestamp", 0),
            "value_eth": data.get("value_eth", 0.0),
            "gas_used": data.get("gas_used", 0),
            "is_error": data.get("is_error", 0)
        })
        
    df_nodes = pd.DataFrame(nodes_data)
    df_edges = pd.DataFrame(edges_data)
    
    out_dir = os.path.join(os.path.dirname(__file__), "simulated_data")
    os.makedirs(out_dir, exist_ok=True)
    
    df_nodes.to_csv(os.path.join(out_dir, "nodes.csv"), index=False)
    df_edges.to_csv(os.path.join(out_dir, "edges.csv"), index=False)
    print(f"[*] Saved nodes.csv and edges.csv to {out_dir}/")

if __name__ == "__main__":
    main()
