from fastapi import APIRouter, Depends
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import joinedload
from app.models.orders import oi_recent
from typing import Annotated
from starlette import status
from fastapi import HTTPException
from app.models.orders import order_items
from .dependecies import get_current_user
from pydantic import BaseModel
from typing import Literal


router = APIRouter(prefix="/order_item_recent", tags=["Order Item Recent"])
db_dependency = Annotated[AsyncSession, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/order_item_recent/view")
async def order_item_recent_add(db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )
    result = await db.execute(select(oi_recent))
    return result.scalars().all()


@router.post(
    "/order_items_recent/create/{order_id}", status_code=status.HTTP_201_CREATED
)
async def order_items_recent_put(
    db: db_dependency, order_id: int, user: user_dependency
):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )
    result = await db.execute(
        select(order_items)
        .options(joinedload(order_items.orders), joinedload(order_items.items))
        .filter(order_items.order_id == order_id)
    )
    oi_model = result.scalars().all()

    if not oi_model:
        raise HTTPException(status_code=404, detail="not found items ")

    tottel_price = sum(oi.items.price * oi.quantity for oi in oi_model)

    result = await db.execute(select(oi_recent).filter(oi_recent.order_id == order_id))
    existing_order = result.scalars().first()

    if existing_order:
        # Update existing oi_recent with total price
        existing_order.tottel_price = tottel_price
        await db.commit()
        await db.refresh(existing_order)
        return {
            "id": existing_order.id,
            "order_id": existing_order.order_id,
            "tottel_price": existing_order.tottel_price,
            "status": existing_order.status,
            "message": "Total price updated",
        }

    recent_items = {
        "order_id": order_id,
        "tottel_price": tottel_price,
        "status": "new",
    }
    recent_items_model = oi_recent(**recent_items)
    db.add(recent_items_model)
    await db.commit()
    await db.refresh(recent_items_model)
    return {
        "id": recent_items_model.id,
        "order_id": recent_items_model.order_id,
        "tottel_price": recent_items_model.tottel_price,
        "status": recent_items_model.status,
    }


@router.delete(
    "/order_item_recent/delete/{order_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def order_item_recent_delete(
    order_id: int, db: db_dependency, user: user_dependency
):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )
    await db.execute(delete(oi_recent).where(oi_recent.order_id == order_id))
    await db.commit()


@router.delete("/order_item_recent", status_code=status.HTTP_204_NO_CONTENT)
async def order_item_recent(db: db_dependency, user: user_dependency):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )
    await db.execute(delete(oi_recent))
    await db.commit()


class StatusUpdate(BaseModel):
    status: Literal["new", "prepared", "delivered"]


@router.put(
    "/order_items_recent/update-status/{order_id}", status_code=status.HTTP_200_OK
)
async def update_oi_recent_status(
    order_id: int, status_data: StatusUpdate, db: db_dependency, user: user_dependency
):
    """
    Update the status of order items recent.
    Status progression: new → prepared → delivered
    """
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )

    result = await db.execute(select(oi_recent).filter(oi_recent.order_id == order_id))
    recent_order = result.scalars().first()

    if not recent_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order items recent not found"
        )

    # Validate status progression
    status_order = ["new", "prepared", "delivered"]
    current_status_index = status_order.index(recent_order.status)
    new_status_index = status_order.index(status_data.status)

    if new_status_index <= current_status_index:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot change status from '{recent_order.status}' to '{status_data.status}'. Status can only move forward: new → prepared → delivered",
        )

    recent_order.status = status_data.status
    await db.commit()
    await db.refresh(recent_order)

    return {
        "id": recent_order.id,
        "order_id": recent_order.order_id,
        "tottel_price": recent_order.tottel_price,
        "status": recent_order.status,
    }
