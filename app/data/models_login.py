#This is the structure for the data points in the database
from sqlalchemy import Column, Integer, String
from app.data.database_login import Base_login
from flask_login import UserMixin
from app import login_manager
import colorsys
from random import randint


class User(UserMixin, Base_login):
    __tablename__ = 'users'
    id = Column(Integer(), unique=True, primary_key=True)
    role            = Column(String(10))
    username        = Column(String(50), unique=True)
    password_hash   = Column(String(60))
    color = Column(String(15))


    def __init__(self, username, password_hash, id, hue=-1, role="none"):
        self.id = id
        self.role           = role
        self.username       = username
        self.password_hash  = password_hash
        if (hue==-1):
            hue = randint (0, 360)
        self.color = "{}, 75%, 45%".format(hue)

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))
