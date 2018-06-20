from flask import render_template
from app import app
from sqlalchemy import Column, Integer, String
from app.data.database import Base, db_session
from app.data.check import check_db
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
	check_db();
	print ('fucc')
	#add a fake camper for testing
	add_camper('oofie', 'twoof')
	print (db_session.query(Camper).count())

	#grab camper data
	camper_data = db_session.query(Camper)

	return render_template('viewdb.html', campers=camper_data)

#test page
@app.route('/print')
def index():
	return render_template('testform.html')
