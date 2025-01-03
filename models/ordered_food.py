from models.basemodel import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship


class OrderedFood(BaseModel, Base):
    __tablename__ = "orderedfoods"
    client_id = Column(String(60), ForeignKey("clients.id"), nullable=False)
    food_id = Column(String(60), ForeignKey("foods.id"), nullable=False)
    is_served = Column(Boolean, default=False)
    is_started = Column(Boolean, default=False)  # new column
    voice_order = Column(Boolean)  # new column
    special_order = Column(String(128))  # new column
    priority = Column(Integer, default=0)  # new column

    foodrating = relationship("FoodRating", backref="orderedfood")
