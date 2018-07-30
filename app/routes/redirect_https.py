from flask import request, redirect
from app import app

# Uncomment the following line for https
# @app.before_request
def before_request():
	if request.url.startswith('http://'):
		url = request.url.replace('http://', 'https://', 1)
		code = 301
		return redirect(url, code=code)
