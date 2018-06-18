from flask import Flask
from app.configs.config_flask import Config

app = Flask(__name__)
app.config.from_object(Config)

from app.pages import main_page, form_test
