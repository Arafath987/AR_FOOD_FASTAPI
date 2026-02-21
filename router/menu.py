from fastapi import APIRouter, Depends, Path, HTTPException
from typing import Annotated
from models import items, category, orders, order_items
from database import sessionlocal
from sqlalchemy.orm import Session, joinedload
from schemas import CategoryBase, ItemBase, orderBase, order_item_base
from starlette import status

router = APIRouter(prefix="/menu", tags=["menu"])


def get_db():
    db = sessionlocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
##############get################


@router.get("/categories", status_code=status.HTTP_200_OK)
async def category_read_all(db: db_dependency):
    return db.query(category).all()


@router.post("/create_category", status_code=status.HTTP_201_CREATED)
async def create_category(db: db_dependency, category_request: CategoryBase):
    category1 = (
        db.query(category)
        .filter(category.category == category_request.category)
        .first()
    )
    if category is not None:
        raise HTTPException(status_code=409, detail="category already exist")

    category_model = category(**category_request.model_dump())
    db.add(category_model)
    db.commit()


@router.get("/all_items", status_code=status.HTTP_200_OK)
async def items_read_all(db: db_dependency):
    return db.query(items).all()


@router.get("/all_items_with_categories", status_code=status.HTTP_200_OK)
async def items_with_category(db: db_dependency):
    return db.query(items).options(joinedload(items.category)).all()


@router.get(
    "/items_using_category/{category_name}", status_code=status.HTTP_201_CREATED
)
async def item_in_category(db: db_dependency, category_name: str):
    category_model = (
        db.query(category).filter(category.category == category_name).first()
    )  # .__dict__    #this make category_model object () not use then errror occure,we can us.__dict__ change it to dict
    item_detailed = (
        db.query(items)
        .options(joinedload(items.category))
        .filter(category_model.id == items.category_id)
        .all()
    )  # joined table items and category
    return item_detailed


@router.post("/create_items/{category_name}", status_code=status.HTTP_201_CREATED)
async def create_items(
    db: db_dependency,
    item_request: ItemBase,
    category_name: str = Path(min_length=4, max_length=10),
):
    category_model = (
        db.query(category).filter(category.category == category_name).first()
    )
    category_id = category_model.id
    item_model = items(**item_request.model_dump(), category_id=category_id)
    db.add(item_model)
    db.commit()


@router.get("/orders/all_ordes", status_code=status.HTTP_200_OK)
async def order_profile(db: db_dependency):
    profile_model = db.query(orders).all()
    return profile_model


@router.post("/orders/create_orders", status_code=status.HTTP_200_OK)
async def create_order_profile(db: db_dependency, order_request: orderBase):
    order_model = orders(**order_request.model_dump())
    db.add(order_model)
    db.commit()


@router.get("/all_order_items", status_code=status.HTTP_200_OK)
async def order_items_detailed(db: db_dependency):
    oi_model = (
        db.query(order_items)
        .options(joinedload(order_items.items), joinedload(order_items.orders))
        .all()
    )
    oi_model_new = [
        {
            "items_name": oi.items.name,
            "price": oi.items.price,
            "order_id": oi.order_id,
        }
        for oi in oi_model
    ]

    return oi_model_new


@router.get("/all_order_items_with_order_id/{order_id}", status_code=status.HTTP_200_OK)
async def order_items_detailed(db: db_dependency, order_id):
    oi_model = (
        db.query(order_items)
        .options(joinedload(order_items.orders), joinedload(order_items.items))
        .filter(order_items.order_id == order_id)
        .all()
    )
    oi_model_new = [
        {"id": oi.id, "name": oi.items.name, "price": oi.items.price} for oi in oi_model
    ]  # list comprehensation method
    tottel_price = sum(oi.items.price for oi in oi_model)
    orders_model = db.query(orders).filter(orders.id == order_id).first()
    table_number = orders_model.table_number
    seat_number = orders_model.seat_number
    return {
        "items": oi_model_new,
        "table_number": table_number,
        "seat_number": seat_number,
        "order_id": int(order_id),
        "tottel_price": tottel_price,
    }


@router.post("/orders/create_order_item_in_order", status_code=status.HTTP_200_OK)
async def create_order(db: db_dependency, oi_request: order_item_base):
    order_id = db.query(orders).filter(orders.id == oi_request.order_id).first()
    item_id = db.query(items).filter(items.id == oi_request.item_id).first()
    if order_id is not None and item_id is not None:
        oi_model = order_items(**oi_request.model_dump())
        db.add(oi_model)
        db.commit()
    elif order_id is None:
        raise HTTPException(status_code=404, detail="order_id not found")
    else:
        raise HTTPException(status_code=404, detail="item_id is not found")
