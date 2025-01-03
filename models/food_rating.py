from models.basemodel import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Integer


class FoodRating(BaseModel, Base):
    __tablename__ = "foodratings"
    ordered_food_id = Column(String(60), ForeignKey("orderedfoods.id"), nullable=False)
    rating = Column(Integer)
    message = Column(String(60))
