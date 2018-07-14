from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

engine_login = create_engine('sqlite:///data/logins.db', convert_unicode=True)
db_session_login = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine_login))
Base_login = declarative_base()
Base_login.query = db_session_login.query_property()

def init_db_login():
    print ('initializing login db...')
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import app.data.models_login
    Base_login.metadata.create_all(bind=engine_login)

    from app.data.models_login import User
    u = User(username="Placeholder", password_hash="", id=0)

    db_session_login.add(u)
    db_session_login.commit()
