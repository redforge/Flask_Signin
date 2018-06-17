#This is the structure for the data points in the database
from sqlalchemy import Column, Integer, String
from app.data.database import Base
from app.configs.constants import id_length

#Test class for a kid
class Camper(Base):
    __tablename__ = 'campers'
    id = Column(String(id_length), primary_key=True, unique=True)
    firstname = Column(String(40))
    lastname  = Column(String(80))

    def __init__(self, id=None, firstname=None, lastname=None):
        self.id        = id
        self.firstname = firstname
        self.lastname  = lastname

    def __repr__(self):
        return '<Camper %r>' % (self.name)

#This was an example, I'm going to leave it in for now
'''class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True)
    email = Column(String(120), unique=True)

    def __init__(self, name=None, email=None):
        self.name = name
        self.email = email

    def __repr__(self):
        return '<User %r>' % (self.name)'''
