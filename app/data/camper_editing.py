from app.data.database import Base, db_session, init_db
from app.data.models import Camper
from app.data.encoding import encode_id

def add_camper(firstname, lastname):
	index = db_session.query(Camper).count()
	c = Camper(id=encode_id(index), firstname=firstname, lastname=lastname)
	db_session.add(c)
	db_session.commit()
