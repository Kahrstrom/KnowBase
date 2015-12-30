from flask import Flask, request, jsonify, abort, session

from werkzeug import generate_password_hash, check_password_hash, secure_filename
from functools import update_wrapper
import os
import pypyodbc
import collections

app = Flask(__name__)
app.secret_key = 'qwertyasdfghzxcvb'

db_name = os.environ['KNOWBASE_DB']
db_uid = os.environ['KNOWBASE_UID']
db_pw = os.environ['KNOWBASE_PW']
server_type = '{SQL Server}'
server_name = os.environ['KNOWBASE_SERVER']
host_ip = os.environ['KNOWBASE_HOST']

ALLOWED_EXTENSIONS = set(['jpeg', 'jpg', 'png', 'gif'])


#app.secret_key = 'devkey'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://test_user:pass@localhost:5432/knowledge_test'
#db.init_app(app)


connection_string = "DRIVER={type};SERVER={server};UID={uid};PWD={pw};DATABASE={db}".format(
	type=server_type, server=server_name, uid=db_uid, pw=db_pw, db=db_name)

print(connection_string)

conn = pypyodbc.connect(connection_string)
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

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return app.send_static_file('base.html')



@app.route('/api/skilltypes', methods=['GET'])
@require_login()
def skill_types():
    skilltypes = cursor.execute("SELECT [{localize}] as 'locale', [name] FROM [skilltype] st INNER JOIN [localization] l ON l.[idlocalization] = st.[localization] ORDER BY [order]".format(localize=session['locale'])).fetchall()
    retval = serialize_table([['locale'], ['name']], skilltypes)

    return jsonify(data=retval)

@app.route('/api/profilepicture', methods=['POST'])
@require_login()
def upload_profile_picture():
    extension = request.json['extension']
    data = request.json['data']

    if data and allowed_file("." + extension):
        cursor.execute("EXECUTE sp_add_profile_picture @@email = '{email}', @@data = '{data}',"
                       "@@extension = '{extension}', @@filename = '{filename}'".format(email=session['email'],
                                                                                   data=data,
                                                                                   extension=extension,
                                                                                   filename='profilepicture'))
        cursor.commit()


    return jsonify(response='success')

@app.route('/api/profilepicture', methods=['GET'])
@require_login()
def get_profile_picture():
    img = cursor.execute("EXECUTE sp_get_profile_picture @@email='{email}'".format(email=session['email'])).fetchone()

    return jsonify({'data': img[0], 'extension': img[1]})

@app.route('/api/profile', methods=['POST'])
@require_login()
def update_profile():

    update_stmt = update_table_from_request("profile", request)
    cursor.execute(update_stmt)
    cursor.commit()
    return jsonify(response='success')


@app.route('/api/login', methods=['POST'])
def login():
    json_data = request.json
    email = json_data['email']
    password = json_data['password']

    user = cursor.execute('SELECT [iduser],[password] FROM [user] WHERE [email] = ?', [email]).fetchone()

    if user is None:
        return jsonify(response=False)

    if check_password_hash(user[1], password):
        session['email'] = email
        return jsonify(response=True)

    return jsonify(response=False)


@app.route('/api/logout', methods=['GET'])
def logout():
    session.pop('email', None)
    return jsonify(response='success')

@app.route('/api/setLocale', methods=['POST'])
def set_locale():
    session['locale'] = request.json['locale']
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

    cursor.execute('INSERT INTO [profile] ([firstname], [lastname]) VALUES (?,?)', [firstname, lastname])
    idprofile = cursor.execute("SELECT @@IDENTITY").fetchone()
    cursor.commit()

    
    cursor.execute('INSERT INTO [user] ([email],[password],[profile]) VALUES (?, ?, ?)',
                   [email, generate_password_hash(password), idprofile[0]])
    cursor.commit()

    return jsonify(response='success')

@app.route('/api/profile', methods=['GET'])
@require_login()
def profile():

    user = cursor.execute("SELECT [iduser],[profile] FROM [user] WHERE [email] = ?", [session['email']]).fetchone()

    if user is None:
        return abort(404)
    profile = cursor.execute("SELECT * FROM [profile] WHERE [idprofile] = ?", [user[1]]).fetchone()
    profile = serialize_row(profile.cursor_description, profile)

    return jsonify(data=profile)


@app.route('/api/educations', methods=['GET'])
@require_login()
def get_user_educations():
    educations = cursor.execute("SELECT e.* FROM [education] e INNER JOIN [profile] p ON p.[idprofile] = e.[profile] "
                                "INNER JOIN [user] u ON u.[profile] = p.[idprofile] WHERE u.[email] = ? "
                                "ORDER BY e.[enddate] DESC", [session['email']]).fetchall()


    if len(educations) == 0:
        return abort(404)

    return jsonify(data=serialize_table(educations[0].cursor_description, educations))
   


@app.route('/api/educations/<int:ideducation>', methods=['GET'])
@require_login()
def get_education(ideducation):
    #education = Education.query.filter(Education.ideducation == ideducation)
    #if education.count() == 0:
    return abort(404)
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
    t = []
    for r in values:
        t.append(serialize_row(columns, r))
    return t

def serialize_row(columns, values):
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
            if data[field] is not None:
                statement = "[{field}] = '{val}',".format(field=field,val=data[field])
            else:
                statement = "[{field}] = {val},".format(field=field,val="NULL")
            SQL = SQL + statement

    SQL = SQL[:len(SQL)-1] + " WHERE [{idfield}] = {idvalue}".format(idfield="id"+table,idvalue=data["id"+table])
    return SQL


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host=host_ip, port=port)