from pydantic import BaseModel, EmailStr, Field
from typing import Literal


class CategoryBase(BaseModel):
    category: str = Field(
        min_length=4, max_length=10, description="Category name (4 to 10 characters)"
    )

    model_config = {"json_schema_extra": {"example": {"category": "Drinks"}}}


class ItemBase(BaseModel):
    name: str = Field(
        min_length=5, max_length=15, description="Item name (5 to 15 characters)"
    )
    description: str = Field(
        min_length=10,
        max_length=100,
        description="Item description (10 to 100 characters)",
    )
    rating: int = Field(gt=0, lt=6, description="Rating must be between 1 and 5")
    price: int = Field(gt=0, description="Item price must be greater than 0")

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "Burger",
                "description": "Spicy chicken burger",
                "rating": 4,
                "price": 150,
            }
        }
    }


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


class UserBase(BaseModel):
    id: int = Field(gt=0, description="User ID must be a positive integer")
    username: str = Field(
        min_length=3,
        max_length=20,
        regex=r"^[a-zA-Z0-9_]+$",
        description="Username (3–20 chars, letters, numbers, underscore only)",
    )
    email: EmailStr = Field(description="Valid email address")
    designation: str = Field(
        min_length=5, max_length=20, description="User designation (5 to 20 characters)"
    )
    phone_number: str = Field(
        regex=r"^[6-9]\d{9}$",
        description="10-digit Indian phone number starting with 6–9",
    )
    password: str = Field(
        min_length=8,
        max_length=100,
        description="Password must be at least 8 characters",
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": 1,
                "username": "yaser_dev",
                "email": "yaser@gmail.com",
                "designation": "Backend Dev",
                "phone_number": "9876543210",
                "password": "StrongPass1",
            }
        }
    }
