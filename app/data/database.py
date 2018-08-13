from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from werkzeug.local import LocalProxy

def get_expected_pathname():

    global db_directory
    from app.data.get_time import get_date
    print ('NAME: path get {}'.format(db_directory + get_date()))

    return db_directory + get_date() + '.sql'

from app.configs.constants import db_directory

initial_db_dir = open('data/BACKUPDATA', 'a+').read()

db_path = '[unset]'
prev_path = '[none]'

if (initial_db_dir == ''):
    print ('No initial db found')
    db_path = ''
else:
    db_path = initial_db_dir



class SessionManager(object):
    def __init__(self):
        self.session = None

    def get_session(self):
        from app.data.database import db_path, prev_path, set_prev_path
        if (db_path == prev_path):
            return self.session
        else:
            print('Updating session path: \'{}\' -> \'{}\''.format(prev_path, db_path))
            engine = create_engine('sqlite:///' + db_path, convert_unicode=True)
            self.session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
            set_prev_path(db_path)
            return self.session

def set_prev_path(val):
    global prev_path
    prev_path = val

def init_db():
    global db_path
    print ('initializing db...')
    import app.data.models

    engine = create_engine('sqlite:///' + db_path, convert_unicode=True)
    Base.metadata.create_all(bind=engine)

def set_path(new_path):
    global db_path, engine, db_session, Base

    db_path = new_path

    print ('SET: path to {}'.format(db_path))

session_manager = SessionManager()
set_path(db_path)
db_session = LocalProxy(session_manager.get_session)

Base = declarative_base()
Base.query = db_session.query_property()
