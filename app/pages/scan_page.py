from flask import render_template, request
from app import app
from sqlalchemy import Column, Integer, String
from app.data.database import Base, db_session
from app.data.check import db_exists
from app.data.models import Camper
from app.data.camper_editing import *
import os.path

lastscan = 'unloaded'

#database thing
@app.teardown_appcontext
def shutdown_session(exception=None):
	db_session.remove()

@app.route('/scan')
def scan():
	global lastscan
	lastscan = 'none yet...'
	#If no database is found, make one
	if (not os.path.isfile('./data/current.db')):
		print('No database found. Making a new one...')
		init_db()

	#add a fake camper for testing
	add_camper('oofie', 'twoof')
	print (db_session.query(Camper).count())

	#grab camper data
	camper_data = db_session.query(Camper)

	return render_template('scanningpage.html', lastscan=lastscan)

@app.route('/api', methods = ['POST'])
def api():
	getId = request.values.get('input', '')
	# Do something useful here...
	camper = db_session.query(Camper).get(getId)

	out = "<tr>  <td>{}</td> <td>{}</td> <td>{}</td>  </tr>".format(camper.id, camper.firstname, camper.lastname)

	print ("{} {} (id:{})".format(camper.firstname, camper.lastname, camper.id))
	return out
