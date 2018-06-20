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
	getId = request.values.get('input', '')
	# Do something useful here...
	camper = db_session.query(Camper).get(getId)

	out = "<tr>  <td>{}</td> <td>{}</td> <td>{}</td>  </tr>".format(camper.id, camper.firstname, camper.lastname)

	print ("{} {} (id:{})".format(camper.firstname, camper.lastname, camper.id))
	return out
