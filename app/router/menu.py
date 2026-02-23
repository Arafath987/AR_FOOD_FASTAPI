from fastapi import APIRouter, Depends, Path, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session, joinedload
from starlette import status
from app.database import sessionlocal
from app.models.items import items, category
from app.models.orders import orders, order_items
from app.schemas.items import CategoryBase, ItemBase
from app.schemas.orders import OrderBase, OrderItemBase

router = APIRouter(prefix="/menu", tags=["Menu"])


# --------------------DB Dependency--------------------


def get_db():
    db = sessionlocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


# -------------------- Category API --------------------


@router.get("/categories", status_code=status.HTTP_200_OK)
def get_all_categories(db: db_dependency):
    return db.query(category).all()


@router.post("/categories", status_code=status.HTTP_201_CREATED)
def create_category(db: db_dependency, request: CategoryBase):
    existing_category = (
        db.query(category).filter(category.category == request.category).first()
    )

    if existing_category:
        raise HTTPException(status_code=409, detail="Category already exists")

    new_category = category(**request.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


# --------------------Item API--------------------


@router.get("/items", status_code=status.HTTP_200_OK)
def get_all_items(db: db_dependency):
    return db.query(items).all()


@router.get("/items/with-category", status_code=status.HTTP_200_OK)
def get_items_with_category(db: db_dependency):
    return db.query(items).options(joinedload(items.category)).all()


@router.get("/items/by-category/{category_name}", status_code=status.HTTP_200_OK)
def get_items_by_category(db: db_dependency, category_name: str):
    category_model = (
        db.query(category).filter(category.category == category_name).first()
    )

    if not category_model:
        raise HTTPException(status_code=404, detail="Category not found")

    return (
        db.query(items)
        .options(joinedload(items.category))
        .filter(items.category_id == category_model.id)
        .all()
    )


@router.post("/items/{category_name}", status_code=status.HTTP_201_CREATED)
def create_item(
    db: db_dependency,
    request: ItemBase,
    category_name: str = Path(min_length=4, max_length=10),
):
    category_model = (
        db.query(category).filter(category.category == category_name).first()
    )

    if not category_model:
        raise HTTPException(status_code=404, detail="Category not found")

    new_item = items(**request.model_dump(), category_id=category_model.id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


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


# -------------------- Order Item API--------------------


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
