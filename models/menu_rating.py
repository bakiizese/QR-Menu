from models.basemodel import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Integer


class MenuRating(BaseModel, Base):
    __tablename__ = "menuratings"
    client_id = Column(String(60), ForeignKey("clients.id"), nullable=False)
    rating = Column(Integer)
    message = Column(String(60))
