from flask import render_template, request
from app import app
from sqlalchemy import Column, Integer, String
from app.data.database import Base, db_session
from app.data.check import db_exists
from app.data.models import Camper
from app.data.camper_editing import *
import os.path

@app.route('/api/test/print', methods = ['POST'])
def api_print():
	out = request.values.get('input')
	print (out)
	return 'success'

@app.route('/print')
def print_page():
	return render_template('testingform.html')

@app.route('/api/edit', methods = ['POST'])
def api_edit():
	field_to_set = request.values.get('field-to-set')
	new_value = request.values.get('new-value')
	ids_to_apply_to = request.values.get('ids-to-apply-to')

	ids_parsed = ids_to_apply_to.split(',')

	if (field_to_set == 'remove' and new_value == 'remove'):
		for id in ids_parsed:
			db_session.query(Camper).filter_by(id=id).delete()
	else:
		for id in ids_parsed:
			camper = db_session.query(Camper).get(id)
			print(id);
			if   (field_to_set == 'location'):
				camper.location = new_value
			elif (field_to_set == 'firstname'):
				camper.firstname= new_value
			elif (field_to_set == 'lastname'):
				camper.lastname = new_value
			elif (field_to_set == 'notes'):
				camper.notes    = new_value
			else:
				return "Error: Unknown Field"

	db_session.commit()
	return 'success'

@app.route('/api/add', methods = ['POST'])
def api_add():
	#TODO
	db_session.commit()
	return 'success'
