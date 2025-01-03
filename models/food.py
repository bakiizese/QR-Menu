from models.basemodel import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, JSON, Boolean, Integer
from sqlalchemy.orm import relationship


class Food(BaseModel, Base):
    __tablename__ = "foods"
    admin_id = Column(String(60), ForeignKey("admins.id"), nullable=False)
    food_name = Column(String(60), nullable=False)
    image_path = Column(String(60), nullable=False)
    ingredients = Column(JSON, nullable=False)
    is_available = Column(Boolean, default=True)
    food_type = Column(String(60), nullable=False)
    is_fasting_food = Column(Boolean, default=False)
    payment = Column(Integer, nullable=False)  # new column

    orderedfood = relationship("OrderedFood", backref="food")
