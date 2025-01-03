from models.basemodel import BaseModel, Base
from sqlalchemy import Column, String


class Chef(BaseModel, Base):
    __tablename__ = "chefs"
    first_name = Column(String(60), default="unknownChef")
    last_name = Column(String(60), default="unknownChef")
