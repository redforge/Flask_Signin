from flask import render_template
from app import app
from sqlalchemy import Column, Integer, String
from app.data.database import Base, db_session
from app.data.check import check_db
from app.data.models import Camper
from app.data.camper_editing import get_locations
import os.path
from flask_login import current_user, login_required
from app.data.user_roles import has_permission


#database thing
@app.teardown_appcontext
def shutdown_session(exception=None):
	db_session.remove()


@app.route('/readwrite')
@login_required
def readwrite():
	#check if user has proper permissions
	if (has_permission(current_user.role, 'write')):
		#If no database is found, make one
		check_db();

		#grab camper data
		camper_data = db_session.query(Camper)

		return render_template('readwrite.html', campers=camper_data, locations=get_locations())
	else:
		return render_template('denied.html')

@app.route('/readonly')
@login_required
def readonly():
	#check if user has proper permissions
	if (has_permission(current_user.role, 'read')):
		#If no database is found, make one
		check_db();

		#grab camper data
		camper_data = db_session.query(Camper)

		return render_template('readonly.html', campers=camper_data, locations=get_locations())
	else:
		return render_template('denied.html')


@app.route('/licenses')
def license_page():
	return render_template('licenses.html')

@app.context_processor
def get_userdata():
	loggedin = current_user.is_authenticated;
	if (loggedin):
		accentcolor = current_user.color
	else:
		accentcolor = '215, 17%, 50%'
	return dict(loggedin=loggedin, user=current_user, accentcolor=accentcolor)
