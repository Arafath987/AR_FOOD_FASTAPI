from models.base import Base
from sqlalchemy import Column, Integer, LargeBinary, String, ForeignKey
from sqlalchemy.orm import relationship


class items(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    rating = Column(Integer)
    price = Column(Integer)
    category_id = Column(Integer, ForeignKey("category.id"))
    image = Column(LargeBinary)

    category = relationship("category", back_populates="items")  # Add relationship
    order_items = relationship("order_items", back_populates="items")


class category(Base):
    __tablename__ = "category"
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String)

    items = relationship("items", back_populates="category")  # Add reverse relationship
