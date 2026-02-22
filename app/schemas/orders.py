from pydantic import BaseModel, EmailStr, Field
from typing import Literal


class OrderBase(BaseModel):
    table_number: int = Field(
        gt=0, description="Table number must be a positive integer"
    )
    seat_number: int = Field(gt=0, description="Seat number must be a positive integer")
    name: str = Field(
        min_length=4, max_length=20, description="Customer name (4 to 20 characters)"
    )

    model_config = {
        "json_schema_extra": {
            "example": {"table_number": 1, "seat_number": 2, "name": "Yaser"}
        }
    }


class OrderItemBase(BaseModel):
    order_id: int = Field(gt=0, description="Order ID must be a positive integer")
    item_id: int = Field(gt=0, description="Item ID must be a positive integer")

    model_config = {"json_schema_extra": {"example": {"order_id": 1, "item_id": 2}}}


class OrderItemRecentBase(BaseModel):
    order_id: int = Field(gt=0, description="Order ID must be a positive integer")
    total_price: int = Field(gt=0, description="Total price must be greater than 0")
    status: Literal["pending", "paid", "shipped", "cancelled"]

    model_config = {
        "json_schema_extra": {
            "example": {"order_id": 1, "total_price": 2500, "status": "paid"}
        }
    }
