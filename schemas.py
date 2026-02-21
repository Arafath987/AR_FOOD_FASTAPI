from pydantic import BaseModel, Field


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
    


class order_item_recent(BaseModel):
    order_id:int
    
    
