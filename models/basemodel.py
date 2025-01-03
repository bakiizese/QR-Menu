from sqlalchemy.ext.declarative import declarative_base
from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, DateTime, String
import models

Base = declarative_base()
format = "%Y-%m-%dT%H:%M:%S.%f"


class BaseModel(Base):
    __abstract__ = True
    id = Column(String(60), primary_key=True)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now())

    def __init__(self, *args, **kwargs):
        if kwargs:
            for k, v in kwargs.items():
                if k != "__class__":
                    setattr(self, k, v)
            if kwargs.get("created_at", None) and type(kwargs.get("created_at")) is str:
                self.created_at = datetime.strptime(kwargs["created_at"], format)
            else:
                self.created_at = datetime.now()
            if kwargs.get("updated_at", None) and type(kwargs.get("updated_at")) is str:
                self.created_at = datetime.strptime(kwargs["created_at"], format)
            else:
                self.updated_at = datetime.now()
            if kwargs.get("id", None) is None:
                self.id = str(uuid4())
        else:
            self.id = str(uuid4())
            self.created_at = datetime.now()
            self.updated_at = datetime.now()

    def __str__(self):
        return "[{:s}] ({:s}) {}".format(
            self.__class__.__name__, self.id, self.__dict__
        )

    def save(self):
        self.updated_at = datetime.now()
        models.storage.new(self)
        models.storage.save()

    def to_dict(self, **kwargs):
        new_dict = self.__dict__.copy()
        if "created_at" in new_dict:
            new_dict["created_at"] = new_dict["created_at"].strftime(format)
        if "updated_at" in new_dict:
            new_dict["updated_at"] = new_dict["updated_at"].strftime(format)
        if "_sa_instance_state" in new_dict:
            del new_dict["_sa_instance_state"]
        if kwargs:
            for key in kwargs.keys():
                if key in new_dict.keys():
                    del new_dict[key]

        return new_dict
