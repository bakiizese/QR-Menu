from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from models.basemodel import Base
from models.admin import Admin
from models.chef import Chef
from models.client import Client
from models.food import Food
from models.ordered_food import OrderedFood
from models.food_rating import FoodRating
from models.menu_rating import MenuRating


mysql_user = "qrmenu_user"
mysql_pwd = "qrmenu_pwd"
mysql_host = "localhost"
mysql_db = "qrmenu_db"

classes = {
    "Admin": Admin,
    "Chef": Chef,
    "Client": Client,
    "Food": Food,
    "OrderedFood": OrderedFood,
    "FoodRating": FoodRating,
    "MenuRating": MenuRating,
}


class DBStorage:
    __engine = ""
    __session = ""

    def __init__(self):
        self.__engine = create_engine(
            "mysql+mysqldb://{}:{}@{}/{}".format(
                mysql_user, mysql_pwd, mysql_host, mysql_db
            )
        )

    def reload(self):
        Base.metadata.create_all(self.__engine)
        sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        Session = scoped_session(sess_factory)
        self.__session = Session

    def new(self, obj):
        try:
            self.__session.add(obj)
        except:
            self.__session.rollback()

    def save(self):
        try:
            self.__session.commit()
        except:
            self.__session.rollback()

    def get(self, cls, id):
        data = self.__session.query(classes[cls]).filter_by(id=id).first()
        return data

    def get_all(self, cls, **kwargs):
        if kwargs:
            return self.__session.query(classes[cls]).filter_by(**kwargs).all()
        return self.__session.query(classes[cls]).all()

    def update(self, cls, id, **kwargs):
        instance = self.get(cls, id)
        if not instance:
            return False
        for key, value in kwargs.items():
            self.__session.query(classes[cls]).filter_by(id=id).update(
                {key: value}, synchronize_session=False
            )
        self.save()
        return True

    def delete(self, cls, id):
        instance = self.get(cls, id)
        if not instance:
            return False
        try:
            self.__session.delete(instance)
            self.save()
        except:
            self.__session.rollback()
        return True

    def count(self, cls):
        return self.__session.query(classes[cls]).count()
