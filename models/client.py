from models.basemodel import BaseModel, Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class Client(BaseModel, Base):
    __tablename__ = "clients"
    first_name = Column(String(60), default="unknownclient")
    last_name = Column(String(60), default="unknownclient")
    table_number = Column(String(60), nullable=False)

    orderedfood = relationship("OrderedFood", backref="client")
    menurating = relationship("MenuRating", backref="client")
