from fastapi import APIRouter, Depends, Path, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session, joinedload
from starlette import status
from app.database import get_db
from app.models.items import items, category
from app.schemas.items import CategoryBase, ItemBase

router = APIRouter(prefix="/items", tags=["Items"])


# -------------------- DB Dependency --------------------


db_dependency = Annotated[Session, Depends(get_db)]


# --------------------Category API--------------------


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


# -------------------- Item API--------------------


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
