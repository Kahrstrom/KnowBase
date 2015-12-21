from flask import Flask, render_template, request, jsonify, abort, session, redirect, url_for

from werkzeug import generate_password_hash, check_password_hash
from functools import update_wrapper
import os
import pypyodbc
import collections
import json

app = Flask(__name__)
app.secret_key = 'devkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://test_user:pass@localhost:5432/knowledge_test'
#db.init_app(app)
conn = pypyodbc.connect("DRIVER={SQL Server};SERVER=localhost\SQLEXPRESS;UID=knowbase;PWD=Vinter2015!;DATABASE=knowbase")
cursor = conn.cursor()

def require_login():
    def decorator(fn):
        def decorated_function(*args, **kwargs):
            if 'email' not in session:
                return abort(401)
            user = cursor.execute("SELECT TOP 1 [iduser] FROM [user] WHERE [email] = ?",[session['email']])
           #user = User.query.filter_by(email=session['email']).first()
            if user.rowcount == 0:
                return abort(401)

            return fn(*args, **kwargs)

        return update_wrapper(decorated_function, fn)

    return decorator


@app.route('/')
def home():
    return app.send_static_file('base.html')


@app.route('/api/profile', methods=['GET'])
@require_login()
def profile():

    user = cursor.execute("SELECT [iduser],[profile] FROM [user] WHERE [email] = ?", [session['email']]).fetchone()

    if user is None:
        return abort(404)
    profile = cursor.execute("SELECT * FROM [profile] WHERE [idprofile] = ?", [user[1]]).fetchone()
    profile = serialize_table(profile.cursor_description, profile)

    return jsonify(data=profile)


@app.route('/api/profile', methods=['POST'])
@require_login()
def update_profile():

    print(update_table_from_request("profile",request))

    user = cursor.execute("SELECT ")
    #user = User.query.filter(User.email == session['email']);

    #idprofile = user.first().profile
    #profile = Profile.query.filter(Profile.idprofile == idprofile)

    #if profile.count() == 0:
    return abort(404)


    #profile.update(request.json)
    #db.session.commit()
    #return jsonify(response='success')


@app.route('/api/login', methods=['POST'])
def login():
    json_data = request.json
    email = json_data['email']
    password = json_data['password']
    user = cursor.execute('SELECT [iduser],[password] FROM [user] WHERE [email] = ?', [email]).fetchone()

    if user is None:
        return jsonify(response=False)

    if check_password_hash(user[1],password):
        session['email'] = email
        return jsonify(response=True)

    return jsonify(response=False)


@app.route('/api/logout', methods=['GET'])
def logout():
    session.pop('email', None)
    return jsonify(response='success')


@app.route('/api/signup', methods=['POST'])
def signup():
    json_data = request.json
    email = json_data['email']
    password = json_data['password']
    firstname = json_data['firstname']
    lastname = json_data['lastname']

    res = cursor.execute('SELECT [iduser],[email] FROM [user] WHERE [email] = ?', [email])

    if res.fetchone() is not None:
        return jsonify(response='user already exists')

    cursor.execute('INSERT INTO [profile] ([firstname], [lastname]) VALUES (?,?)' [firstname, lastname])
    cursor.commit()
    idprofile = cursor.execute("SELECT SCOPE_IDENTITY()").fetchone()

    cursor.execute('INSERT INTO [user] ([email],[password],[profile]) VALUES (?, ?, ?)',
                   [email, generate_password_hash(password), idprofile[0]])
    cursor.commit()

    return jsonify(response='success')


@app.route('/api/educations', methods=['GET'])
@require_login()
def get_user_educations():
    #profile = Profile.query.join(user).filter(user.iduser == profile.user).filter(user.email == session['email'])

    #if profile.count() == 0:
    return abort(401)
    #return jsonify(educations=[e.serialize for e in Education.query.all()])


@app.route('/api/educations/<int:ideducation>', methods=['GET'])
@require_login()
def get_education(ideducation):
    #education = Education.query.filter(Education.ideducation == ideducation)
    #if education.count() == 0:
    abort(404)
    #return jsonify(education=education.first().serialize)


@app.route('/api/educations', methods=['POST'])
@require_login()
def create_education():
    if not request.json or not 'title' in request.json:
        abort(400)
    education = {
        'title': request.json['title'],
        'school': request.json['school'],
        'enddate': request.json['enddate'],
        'description': request.json['description']
    }
    return jsonify(education=education)


def serialize_table(columns, values):
    d = collections.OrderedDict()
    for c in columns:
        t = c[0]
        d[t] = values[t]
    return d

def update_table_from_request(table, request):
    data = request.json
    SQL = "UPDATE [{table}] SET ".format(table=table)
    for field in data:
        if field != "id" + table:
            statement = "[{field}] = '{val}',".format(field=field,val=data[field])
            SQL = SQL + statement

    SQL = SQL[:len(SQL)-1] + " WHERE [{idfield}] = {idvalue}".format(idfield="id"+table,idvalue=data["id"+table])
    return SQL


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='192.168.0.101', port=port)
