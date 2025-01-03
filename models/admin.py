from models.basemodel import BaseModel, Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class Admin(BaseModel, Base):
    __tablename__ = "admins"
    first_name = Column(String(60), nullable=False)
    last_name = Column(String(60), nullable=False)
    role = Column(String(60), default="Employee")

    food = relationship("Food", backref="admin")
