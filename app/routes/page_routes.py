from flask import render_template, request, redirect
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

@app.route('/test')
def test():
	check_db()
	return 'load'


@app.route('/readwrite')
@login_required
def readwrite():
	#check if user has proper permissions
	if (not has_permission(current_user.role, 'write')):
		return render_template('denied.html')

	check_db()
	#grab camper data
	camper_data = db_session.query(Camper)

	return render_template('readwrite.html', campers=camper_data, locations=get_locations())

@app.route('/readonly')
@login_required
def readonly():
	#check if user has proper permissions
	if (not has_permission(current_user.role, 'read')):
		return render_template('denied.html')

	check_db()
	#grab camper data
	camper_data = db_session.query(Camper)

	return render_template('readonly.html', campers=camper_data, locations=get_locations())



@app.route('/history/list')
def history_list():
	check_db()
	from os import listdir
	from app.data.database import db_directory
	history_list = listdir(db_directory)
	history_list_cut = []
	for li in history_list:
		li_cut = li;
		if li_cut.endswith('.sql'):
			li_cut = li_cut[:-4]
		history_list_cut.append({ 'filename':li, 'displayname':li_cut })
	return render_template('historylist.html', files=history_list_cut)

@app.route('/history')
@login_required
def history_page():
	if (not has_permission(current_user.role, 'readhistory')):
		return render_template('denied.html')

	# Check that the file exists
	import os.path
	from app.configs.constants import db_directory
	filename = request.args.get('file')

	if (filename == None):
		return redirect('/history/list')
	elif (not os.path.isfile(db_directory + filename)):
		print('Attempt to access nonexistant file \"{}\"'.format(db_directory + filename))
		return redirect('/history/list')


	from app.data.database_history_viewer import HistoryViewer
	hv = HistoryViewer(filename)

	camper_data = hv.get_session().query(Camper)

	titlename = filename
	if titlename.endswith('.sql'):
		titlename = titlename[:-4]

	return render_template('historypage.html', titlename=titlename,campers=camper_data, locations=get_locations())


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
