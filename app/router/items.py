from fastapi import APIRouter, Depends, Path, HTTPException
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from starlette import status
from app.database import get_db
from app.models.items import items, category
from app.schemas.items import CategoryBase, ItemBase
from .dependecies import get_current_user

router = APIRouter(prefix="/items", tags=["Items"])


db_dependency = Annotated[AsyncSession, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


# --------------------Category API--------------------


@router.get("/categories", status_code=status.HTTP_200_OK)
async def get_all_categories(db: db_dependency):
    result = await db.execute(select(category))
    return result.scalars().all()


@router.post("/categories", status_code=status.HTTP_201_CREATED)
async def create_category(db: db_dependency, request: CategoryBase):
    result = await db.execute(
        select(category).filter(category.category == request.category)
    )
    existing_category = result.scalars().first()

    if existing_category:
        raise HTTPException(status_code=409, detail="Category already exists")

    new_category = category(**request.model_dump())
    db.add(new_category)
    await db.commit()
    await db.refresh(new_category)
    return new_category


# -------------------- Item API--------------------


@router.get("/items", status_code=status.HTTP_200_OK)
async def get_all_items(db: db_dependency):
    result = await db.execute(select(items))
    return result.scalars().all()


@router.get("/items/with-category", status_code=status.HTTP_200_OK)
async def get_items_with_category(db: db_dependency):
    result = await db.execute(select(items).options(joinedload(items.category)))
    return result.scalars().all()


@router.get("/items/by-category/{category_name}", status_code=status.HTTP_200_OK)
async def get_items_by_category(db: db_dependency, category_name: str):
    result = await db.execute(
        select(category).filter(category.category == category_name)
    )
    category_model = result.scalars().first()

    if not category_model:
        raise HTTPException(status_code=404, detail="Category not found")

    result = await db.execute(
        select(items)
        .options(joinedload(items.category))
        .filter(items.category_id == category_model.id)
    )
    return result.scalars().all()


@router.post("/items/{category_name}", status_code=status.HTTP_201_CREATED)
async def create_item(
    db: db_dependency,
    request: ItemBase,
    category_name: str = Path(min_length=4, max_length=10),
):
    result = await db.execute(
        select(category).filter(category.category == category_name)
    )
    category_model = result.scalars().first()

    if not category_model:
        raise HTTPException(status_code=404, detail="Category not found")

    new_item = items(**request.model_dump(), category_id=category_model.id)
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item
