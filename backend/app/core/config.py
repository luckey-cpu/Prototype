import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Bluce Lock - Real-Time Crypto Fraud Attribution"
    VERSION: str = "1.0.0"

    # Celery & Redis
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

    # Neo4j Graph Database
    NEO4J_URI: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    NEO4J_USER: str = os.getenv("NEO4J_USER", "neo4j")
    NEO4J_PASSWORD: str = os.getenv("NEO4J_PASSWORD", "password")

    # PostgreSQL Relational Database
    POSTGRES_URI: str = os.getenv("POSTGRES_URI", "postgresql+asyncpg://user:password@localhost:5432/blucelock")

    # Mock RPC settings (for phase 1 testing)
    RPC_ENDPOINT: str = os.getenv("RPC_ENDPOINT", "https://eth-mainnet.alchemyapi.io/v2/mock_key")

    class Config:
        case_sensitive = True

settings = Settings()
