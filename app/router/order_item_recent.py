from fastapi import APIRouter, Depends
from app.database import get_db
from sqlalchemy.orm import Session, joinedload
from app.models.orders import oi_recent
from typing import Annotated
from starlette import status
from fastapi import HTTPException
from app.models.orders import order_items
from .dependecies import get_current_user


router = APIRouter(prefix="/order_item_recent", tags=["Order Item Recent"])
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/order_item_recent/view")
def order_item_recent_add(db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )
    return db.query(oi_recent).all()


@router.post(
    "/order_items_recent/create/{order_id}", status_code=status.HTTP_201_CREATED
)
def order_items_recent_put(db: db_dependency, order_id, user: user_dependency):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )
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


@router.delete(
    "/order_item_recent/delete/{order_id}", status_code=status.HTTP_204_NO_CONTENT
)
def order_item_recent_delete(order_id, db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )
    db.query(oi_recent).filter(oi_recent.order_id == order_id).delete()
    db.commit()


@router.delete("/order_item_recent", status_code=status.HTTP_204_NO_CONTENT)
def order_item_recent(db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )
    db.query(oi_recent).delete()
    db.commit()
