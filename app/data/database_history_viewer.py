from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from werkzeug.local import LocalProxy


class HistoryViewer(object):
    def __init__(self, path):
        from app.data.database import db_directory
        engine = create_engine('sqlite:///' + db_directory + path, convert_unicode=True)
        self.session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
        self.Base = declarative_base()
        self.Base.query = self.session.query_property()
    def get_session(self):
        return self.session
    def get_base(self):
        return self.Base

# session_manager = SessionManager()
# set_path(db_path)
# db_session = LocalProxy(session_manager.get_session)
#
# Base = declarative_base()
# Base.query = db_session.query_property()
