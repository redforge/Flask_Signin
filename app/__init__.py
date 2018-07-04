from flask import Flask
#from flask_sslify import SSLify
from app.configs.config_flask import Config

app = Flask(__name__)
#sslify = SSLify(app)
app.config.from_object(Config)

from app.pages import main_page, scan_page, handle_requests
