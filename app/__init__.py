from flask import Flask
from flask_login import LoginManager
from app.data import user_roles
#from flask_sslify import SSLify
from app.configs.config_flask import Config
import os.path
from flask_bcrypt import Bcrypt

app = Flask(__name__)
#sslify = SSLify(app)
app.config.from_object(Config)

login_manager = LoginManager(app)
flask_bcrypt = Bcrypt(app)

if not os.path.isfile('./data/logins.db'):
    print ('No login database, making one...')
    from app.data.database_login import init_db_login
    init_db_login()

from app.pages import page_routes, scan_page, api_routes, login_routes
