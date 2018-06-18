import os.path
from app.data.database import init_db
def db_exists():
    return os.path.isfile('./data/current.db')

def check_db():
    print ('Performing database check')
    print ('{}:'.format(db_exists()))
    if (not db_exists()):
        print('No database found. Making a new one...')
        init_db()
