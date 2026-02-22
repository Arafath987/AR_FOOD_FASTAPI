from pydantic import BaseModel, EmailStr, Field
from typing import Literal


class CategoryBase(BaseModel):
    category: str = Field(min_length=4, max_length=10)
    model_config = {"json_schema_extra": {"example": {"category": "name1"}}}


class ItemBase(BaseModel):
    name: str = Field(min_length=5, max_length=15)
    description: str = Field(min_length=10, max_length=100)
    rating: int = Field(gt=0, lt=6)
    price: int = Field(gt=0)
    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "name",
                "description": "description",
                "rating": 3,
                "price": 10,
            }
        }
    }

    # class Config:
    #     orm_mode = True


class orderBase(BaseModel):
    table_number: int = Field(gt=0)
    seat_number: int = Field(gt=0)
    name: str = Field(min_length=4, max_length=20)
    model_config = {
        "json_schema_extra": {
            "example": {"table_number": 1, "seat_number": 1, "name": "name"}
        }
    }


class order_item_base(BaseModel):
    order_id: int = Field(gt=0)
    item_id: int = Field(gt=0)
    model_config = {"json_schema_extra": {"example": {"order_id": 1, "item_id": 1}}}


class order_item_recent_base(BaseModel):
    order_id: int = Field(gt=0, description="Order ID must be a positive integer")

    total_price: int = Field(gt=0, description="Total price must be greater than 0")

    status: Literal["pending", "paid", "shipped", "cancelled"]

    model_config = {
        "json_schema_extra": {
            "example": {"order_id": 1, "total_price": 2500, "status": "paid"}
        }
    }


class user(BaseModel):
    id: int = Field(gt=0)

    username: str = Field(min_length=3, max_length=20, regex=r"^[a-zA-Z0-9_]+$")

    email: EmailStr

    designation: str = Field(min_length=5, max_length=20)

    phone_number: str = Field(regex=r"^[6-9]\d{9}$")

    password: str = Field(min_length=8, max_length=100)
    model_config = {
        "json_schema_extra": {
            "example": {
                "id": 1,
                "username": "yaser_dev",
                "email": "yaser@gmail.com",
                "designation": "Backend Dev",
                "phone_number": "9876543210",
                "hashed_password": "StrongPass1",
            }
        }
    }
