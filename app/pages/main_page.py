from flask import render_template
from app import app
from sqlalchemy import Column, Integer, String
from app.data.database import Base, db_session
from app.data.check import check_db
from app.data.models import Camper
from app.data.camper_editing import get_locations
import os.path

#database thing
@app.teardown_appcontext
def shutdown_session(exception=None):
	db_session.remove()

#actual webpage, currently no real frontend lol
@app.route('/')
@app.route('/index')
def index():
	#If no database is found, make one
	check_db();
	#add a fake camper for testing
	print (db_session.query(Camper).count())

	#grab camper data
	camper_data = db_session.query(Camper)

	return render_template('viewdb.html', campers=camper_data, locations=get_locations())
