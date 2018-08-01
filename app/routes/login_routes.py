from flask import render_template, request, redirect
from app import app
from sqlalchemy import Column, Integer, String
from app import login_manager, flask_bcrypt
from app.data.database_login import Base_login, db_session_login
from app.data.models_login import User
from flask_login import login_user, login_required, current_user, logout_user
from app.data.user_roles import has_permission

@app.route('/login/login', methods = ['POST'])
def login_user_page():
    username = request.values.get('username').lower()
    password = request.values.get('password')
    #print("name: {}  pass: {}".format(username, password))
    try:
        user = User.query.filter_by(username=username).one()
    except:
        return ('This username doesn\'t exist')
    pass_check = flask_bcrypt.check_password_hash(user.password_hash, password)
    if (pass_check):
        login_user(user)
        return ('success')
    else:
        return ('Incorrect Password')

@app.route('/login/signup', methods = ['POST'])
def signup_user():
    from app.data.user_roles import get_role_by_code
    rolecode = request.values.get('rolecode')
    user_role = get_role_by_code (rolecode)

    if (user_role[0]): #check if its a valid code
        username = request.values.get('username').lower()
        password = request.values.get('password')
        password_hash = flask_bcrypt.generate_password_hash(password)

        new_id = User.query[-1].id + 1

        u = User(username=username, password_hash=password_hash, id=new_id, role=user_role[1])

        try:
            db_session_login.add(u)
            db_session_login.commit()
        except:
            return ('That username seems to already exist.')
        return ('success')
    else:
        return ('Failed: Invalid code')


@app.route('/login/logout', methods = ['POST'])
@login_required
def logout_user_page():
    logout_user ()
    return ("success")

@app.route('/login/settingset', methods = ['POST'])
@login_required
def change_user_color_lol():
    current_user.color = request.values.get('color')
    u = db_session_login.query(User).filter_by(id=current_user.id).one()
    u.color = request.values.get('color')
    db_session_login.add(u)
    db_session_login.commit()
    return ("success")

@app.route('/login')
def login_page():
    if current_user.is_authenticated:
        return redirect('/autoredirect', code=302)

    return(render_template('loginpage.html') )

@app.route('/')
@app.route('/index')
@app.route('/autoredirect')
def auto_redirect():
    url = '/login'
    if current_user.is_authenticated:
        if has_permission(current_user.role, 'write'):
            url = '/readwrite'
        else:
            url = '/readonly'
    return redirect(url, code=302)

@app.route('/userinfo')
@login_required
def userinfo_page():
    return(render_template('userinfo.html') )

@login_manager.unauthorized_handler
def unauthorized():
    return login_page()
