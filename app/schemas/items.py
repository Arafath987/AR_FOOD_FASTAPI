from pydantic import BaseModel, Field


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
