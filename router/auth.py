from fastapi import APIRouter, Depends, HTTPException
from models import oi_recent, order_items
from typing import Annotated
from database import sessionlocal
from sqlalchemy.orm import Session, joinedload
from starlette import status


router = APIRouter(prefix="/auth", tags=["aut"])


def get_db():
    db = sessionlocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


@router.get("/")
def auth():
    result = []  # normel technique
    for i in range(0, 5 + 1):
        result.append(i * 2)

    result_lc = [i * 2 for i in range(2, 5)]  # list comprehense technique

    return {"auth": "successful", "result": result, "result_lc": result_lc}


@router.get("/order_item_recent/view")
def order_item_recent(db: db_dependency):
    return db.query(oi_recent).all()


@router.post(
    "/order_items_recent/create/{order_id}", status_code=status.HTTP_201_CREATED
)
def order_items_recent(db: db_dependency, order_id):
    oi_model = (
        db.query(order_items)
        .options(joinedload(order_items.orders), joinedload(order_items.items))
        .filter(order_items.order_id == order_id)
        .all()
    )
    if not oi_model:
        raise HTTPException(status_code=404, detail="not found items ")
    tottel_price = sum(oi.items.price for oi in oi_model)
    existing_order = db.query(oi_recent).filter(oi_recent.order_id == order_id).first()
    if existing_order:
        raise HTTPException(status_code=409, detail="Order ID already exists")

    recent_items = {
        "order_id": order_id,
        "tottel_price": tottel_price,
        "status": "paid",
    }
    recent_items_model = oi_recent(**recent_items)
    db.add(recent_items_model)
    db.commit()


@router.delete("/order_item_recent/delete/{order_id}")
def order_item_recent(order_id, db: db_dependency):
    db.query(oi_recent).filter(oi_recent.order_id == order_id).delete()
    db.commit()


@router.delete("/order_item_recent", status_code=status.HTTP_204_NO_CONTENT)
def order_item_recent(db: db_dependency):
    db.query(oi_recent).delete()
    db.commit()
