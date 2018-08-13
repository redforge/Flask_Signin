from flask import Flask
from flask_login import LoginManager
from app.data import user_roles
#from flask_sslify import SSLify
from app.configs.config_flask import Config
import os.path
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config.from_object(Config)

if True:
    from app.data.get_time import get_timedate
    print('\n\n   Log Start - {}\n\n\nNote to dev: Some sql thread errors are expected, they should resolve themselves \n'.format(get_timedate()));

login_manager = LoginManager(app)
flask_bcrypt = Bcrypt(app)

#log only errors and print statements, not every request
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

if not os.path.isfile('./data/logins.db'):
    print ('No login database, making one...')
    from app.data.database_login import init_db_login
    init_db_login()

from app.routes import page_routes, api_routes, login_routes, redirect_https
