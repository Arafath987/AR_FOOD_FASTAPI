from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session, joinedload
from starlette import status
from app.database import get_db
from app.models.items import items
from app.models.orders import orders, order_items
from app.schemas.orders import OrderBase, OrderItemBase

router = APIRouter(prefix="/orders", tags=["Orders"])


db_dependency = Annotated[Session, Depends(get_db)]


# -------------------- Order API--------------------


@router.get("/orders", status_code=status.HTTP_200_OK)
def get_all_orders(db: db_dependency):
    return db.query(orders).all()


@router.post("/orders", status_code=status.HTTP_201_CREATED)
def create_order(db: db_dependency, request: OrderBase):
    new_order = orders(**request.model_dump())
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order


# -------------------- Order Item API --------------------


@router.get("/order-items", status_code=status.HTTP_200_OK)
def get_all_order_items(db: db_dependency):
    results = (
        db.query(order_items)
        .options(joinedload(order_items.items), joinedload(order_items.orders))
        .all()
    )

    return [
        {
            "item_name": oi.items.name,
            "price": oi.items.price,
            "order_id": oi.order_id,
        }
        for oi in results
    ]


@router.get("/order-items/{order_id}", status_code=status.HTTP_200_OK)
def get_order_items_by_order_id(db: db_dependency, order_id: int):
    results = (
        db.query(order_items)
        .options(joinedload(order_items.orders), joinedload(order_items.items))
        .filter(order_items.order_id == order_id)
        .all()
    )

    if not results:
        raise HTTPException(status_code=404, detail="Order not found")

    items_list = [
        {"id": oi.id, "name": oi.items.name, "price": oi.items.price} for oi in results
    ]

    total_price = sum(oi.items.price for oi in results)

    order_model = db.query(orders).filter(orders.id == order_id).first()

    return {
        "order_id": order_id,
        "table_number": order_model.table_number,
        "seat_number": order_model.seat_number,
        "items": items_list,
        "total_price": total_price,
    }


@router.post("/order-items", status_code=status.HTTP_201_CREATED)
def create_order_item(db: db_dependency, request: OrderItemBase):
    order_model = db.query(orders).filter(orders.id == request.order_id).first()
    item_model = db.query(items).filter(items.id == request.item_id).first()

    if not order_model:
        raise HTTPException(status_code=404, detail="Order ID not found")

    if not item_model:
        raise HTTPException(status_code=404, detail="Item ID not found")

    new_order_item = order_items(**request.model_dump())
    db.add(new_order_item)
    db.commit()
    db.refresh(new_order_item)
    return new_order_item
