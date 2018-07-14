#This is the structure for the data points in the database
from sqlalchemy import Column, Integer, String
from app.data.database import Base
from app.configs.constants import id_length

#DB class for a kid
class Camper(Base):
    __tablename__ = 'campers'
    id = Column(String(id_length), primary_key=True, unique=True)
    firstname = Column(String(50))
    lastname  = Column(String(100))
    nickname  = Column(String(50))
    location  = Column(String(75))
    note      = Column(String(250))


    def __init__(self, id=None, firstname=None, lastname=None, nickname='', location='Not Yet Set', note=''):
        self.id        = id
        self.firstname = firstname
        self.lastname  = lastname
        self.nickname  = nickname
        self.location  = location
        self.note      = note

    def __repr__(self):
        return '<Camper %r>' % (self.firstname)
