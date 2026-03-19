from app.models.base import Base
from sqlalchemy import Column, Integer, String


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True)
    email = Column(String(255), unique=True)
    designation = Column(String(100))
    phone_number = Column(String(20), unique=True)
    hashed_password = Column(String(255))
