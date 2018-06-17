from flask import render_template
from app import app
from sqlalchemy import Column, Integer, String
from app.data.database import Base, db_session, init_db
from app.data.models import Camper
from app.data.camper_editing import *
import os.path

#database thing
@app.teardown_appcontext
def shutdown_session(exception=None):
	db_session.remove()

#actual webpage, currently no real frontend lol
@app.route('/')
@app.route('/index')
def index():
	print ('shit')
	#If no database is found, make one
	if (not os.path.isfile('./data/current.db')):
		print('No database found. Making a new one...')
		init_db()

	#add a fake camper for testing
	add_camper('oofie', 'twoof')
	print (db_session.query(Camper).count())

	#grab camper data
	camper_data = db_session.query(Camper)

	return render_template('testpage.html', campers=camper_data)
