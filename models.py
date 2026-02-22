from database import Base
from sqlalchemy import Column, Integer, Boolean, LargeBinary, String, ForeignKey
from sqlalchemy.orm import relationship


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    designation = Column(String)
    phone_number = Column(String, unique=True)
    hashed_password = Column(String)


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


class orders(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    table_number = Column(Integer)
    seat_number = Column(Integer)
    name = Column(String)
    order_items = relationship("order_items", back_populates="orders")
    oi_recent = relationship("oi_recent", back_populates="orders")


class order_items(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    item_id = Column(Integer, ForeignKey("items.id"))

    orders = relationship("orders", back_populates="order_items")
    items = relationship("items", back_populates="order_items")


class oi_recent(Base):
    __tablename__ = "order_items_recent"
    order_id = Column(Integer, ForeignKey("orders.id"), primary_key=True, index=True)
    tottel_price = Column(Integer)
    status = Column(String(20))
    orders = relationship("orders", back_populates="oi_recent")
