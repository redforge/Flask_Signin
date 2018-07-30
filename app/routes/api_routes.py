from flask import render_template, request, redirect
from app import app
from sqlalchemy import Column, Integer, String
from app.data.database import Base, db_session
from app.data.check import db_exists
from app.data.models import Camper
from app.data.camper_editing import *
from flask_login import login_required, current_user
from app.data.user_roles import has_permission
import os.path

import json
from collections import namedtuple

@app.route('/api/test/print', methods = ['POST'])
def api_print():
	out = request.values.get('input')
	print (out)
	return 'success'

@app.route('/print')
def print_page():
	return render_template('testingform.html')

@app.route('/api/edit', methods = ['POST'])
@login_required
def api_edit():
	if (not has_permission(current_user.role, 'write')):
		return 'no permission'
	else:
		field_to_set = request.values.get('field-to-set')
		new_value = request.values.get('new-value')
		ids_to_apply_to = request.values.get('ids-to-apply-to')

		ids_parsed = ids_to_apply_to.split(',')

		print (ids_parsed)
		if (field_to_set == 'remove' and new_value == 'remove'):
			for id in ids_parsed:
				db_session.query(Camper).filter_by(id=id).delete()
		else:
			for id in ids_parsed:
				camper = db_session.query(Camper).get(id)
				#print(id);
				if   (field_to_set == 'location'):
					from app.data.get_time import get_time
					camper.location = new_value + " ({})".format(get_time())
				elif (field_to_set == 'firstname'):
					camper.firstname= new_value
				elif (field_to_set == 'lastname'):
					camper.lastname = new_value
				elif (field_to_set == 'note'):
					camper.note     = new_value
				else:
					return "Error: Unknown Field"

		db_session.commit()
		return 'success'

@app.route('/api/add', methods = ['POST'])
@login_required
def api_add():
	if (not has_permission(current_user.role, 'write')):
		return 'no permission'
	else:
		s = request.values.get('new-campers')
		x = json.loads(s, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))

		i = 0
		for c in x:
			add_camper(offset = i, commit=False, firstname=c.firstname, lastname=c.lastname, nickname=c.nickname, location=c.location, note=c.note)
			i += 1
		db_session.commit()
		return 'success'

@app.route('/api/backup')
@app.route('/forcebackup')
@login_required
def backup_db_route():
	if (has_permission(current_user.role, 'administrate')):
		from app.data.camper_editing import backup_database
		filename = backup_database()
		reset_locs()
		return 'Backed up as \"{}\" in serverside data folder'.format(filename)
	else:
		return render_template('denied.html')


def reset_locs():
	for c in db_session.query(Camper):
		c.location = 'Not Signed In'
	db_session.commit()
