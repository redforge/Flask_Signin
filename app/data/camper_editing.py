from app.data.database import Base, db_session, init_db
from app.data.models import Camper
from app.data.encoding import encode_id

location_list = [
	{'short': '577',    'long':'577 (Main Location)'},
	{'short': 'Kesher', 'long':'Kesher'},
	{'short': 'Park',   'long':'Park/Outside'}
]

def add_camper(firstname, lastname, nickname='', location='unset', note='', commit=True, offset=0):
	index = db_session.query(Camper).count() + offset;
	#Make sure the id is unique! If a camper was deleted, it often isn't
	#Tries to fill in earlier empty slots if possible. Once all deleted slots are refilled, this will not run
	if (db_session.query(Camper).filter_by(id=encode_id(index)).count() > 0):
		index = 0
		while (db_session.query(Camper).filter_by(id=encode_id(index)).count() > 0):
			index += 1

	c = Camper(id=encode_id(index), firstname=firstname, lastname=lastname, nickname=nickname, location=location, note=note)
	db_session.add(c)
	if (commit):
		db_session.commit()


def get_locations():
	return location_list
