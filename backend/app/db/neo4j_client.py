import structlog
from neo4j import AsyncGraphDatabase
from app.core.config import settings

logger = structlog.get_logger()

class Neo4jClient:
    def __init__(self):
        self.driver = None

    async def connect(self):
        if not self.driver:
            self.driver = AsyncGraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
            )
            logger.info("Connected to Neo4j", uri=settings.NEO4J_URI)

    async def close(self):
        if self.driver:
            await self.driver.close()
            logger.info("Closed Neo4j connection")

    async def ingest_transaction(self, tx_hash: str, from_address: str, to_address: str, value: float, timestamp: int):
        """
        MERGE the from_address node
        MERGE the to_address node
        CREATE a relationship representing the transaction
        """
        query = """
        MERGE (a:Wallet {address: $from_address})
        MERGE (b:Wallet {address: $to_address})
        CREATE (a)-[:SENT {tx_hash: $tx_hash, value: $value, timestamp: $timestamp}]->(b)
        """
        parameters = {
            "from_address": from_address.lower(),
            "to_address": to_address.lower(),
            "tx_hash": tx_hash.lower(),
            "value": value,
            "timestamp": timestamp
        }

        async with self.driver.session() as session:
            await session.run(query, parameters)
            logger.debug("Ingested transaction edge", tx_hash=tx_hash)

neo4j_client = Neo4jClient()
