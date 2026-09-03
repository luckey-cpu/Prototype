from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import uuid

Base = declarative_base()

class Case(Base):
    __tablename__ = "cases"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_number = Column(String, unique=True, index=True) # e.g., NCRP-2026-00182
    status = Column(String, default="OPEN")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    suspects = relationship("Suspect", back_populates="case")
    reports = relationship("Report", back_populates="case")

class Suspect(Base):
    __tablename__ = "suspects"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("cases.id"))
    wallet_address = Column(String, index=True)
    chain = Column(String)
    reported_tx_hash = Column(String)
    victim_address = Column(String)
    stolen_amount = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    case = relationship("Case", back_populates="suspects")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("cases.id"))
    identified_vasp = Column(String)
    deposit_address = Column(String)
    report_json = Column(Text) # Stores path traversal and evidence
    created_at = Column(DateTime, default=datetime.utcnow)
    
    case = relationship("Case", back_populates="reports")
