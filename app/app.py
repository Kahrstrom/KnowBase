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
    stmt = "EXECUTE sp_get_skilltypes @@email = '{email}', @@locale = '{localize}'".format(
        localize=session['locale'], email=session['email'])

    skilltypes = cursor.execute(stmt).fetchall()

    retval = serialize_table(skilltypes[0].cursor_description, skilltypes)

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
    update_stmt = update_from_request("profile", request)
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


@app.route('/api/options', methods=['GET'])
@require_login()
def get_options():
    table = request.args['table']
    field = request.args['field']
    stmt = "SELECT DISTINCT [{field}] AS 'option' FROM [{table}] ORDER BY [{field}] ASC".format(table=table,field=field)
    options = cursor.execute(stmt).fetchall()
    if len(options) == 0:
        return abort(404)
    return jsonify(data=serialize_table(options[0].cursor_description, options))

@app.route('/api/workexperience', methods=['GET'])
@require_login()
def get_user_workexperience():
    workexperience = cursor.execute("SELECT w.* FROM [workexperience] w INNER JOIN [profile] p ON p.[idprofile] = w.[profile] "
                                "INNER JOIN [user] u ON u.[profile] = p.[idprofile] WHERE u.[email] = ? "
                                "ORDER BY w.[enddate] DESC", [session['email']]).fetchall()


    if len(workexperience) == 0:
        return abort(404)

    return jsonify(data=serialize_table(workexperience[0].cursor_description, workexperience))

@app.route('/api/workexperience', methods=['POST'])
@require_login()
def create_workexperience():

    idworkexperience = request.json['idworkexperience']
    if idworkexperience is None:
        stmt = insert_from_request("workexperience", request)
    else:
        stmt = update_from_request("workexperience", request)

    cursor.execute(stmt)
    cursor.commit()

    return jsonify(response='success')

@app.route('/api/merits', methods=['GET'])
@require_login()
def get_user_merits():
    merits = select_from_table("merit")
    if len(merits) == 0:
        return abort(404)

    return jsonify(data=serialize_table(merits[0].cursor_description, merits))

@app.route('/api/merit', methods=['POST'])
@require_login()
def create_merit():

    idmerit = request.json['idmerit']

    if idmerit is None:
        stmt = insert_from_request("merit", request)
    else:
        stmt = update_from_request("merit", request)

    cursor.execute(stmt)
    cursor.commit()
    return jsonify(response='success')

@app.route('/api/educations', methods=['GET'])
@require_login()
def get_user_educations():
    educations = select_from_table("education")
    if len(educations) == 0:
        return abort(404)

    return jsonify(data=serialize_table(educations[0].cursor_description, educations))


@app.route('/api/education', methods=['POST'])
@require_login()
def create_education():

    ideducation = request.json['ideducation']

    if ideducation is None:
        stmt = insert_from_request("education",request)
    else:
        stmt = update_from_request("education", request)

    cursor.execute(stmt)
    cursor.commit()
    return jsonify(response='success')

@app.route('/api/skills', methods=['GET'])
@require_login()
def get_user_skills():
    skills = select_from_table("skill")
    if len(skills) == 0:
        return abort(404)

    return jsonify(data=serialize_table(skills[0].cursor_description, skills))


@app.route('/api/skill', methods=['POST'])
@require_login()
def create_skill():

    idskill = request.json['idskill']

    if idskill is None:
        stmt = insert_from_request("skill", request)
    else:
        stmt = update_from_request("skill", request)

    cursor.execute(stmt)
    cursor.commit()
    return jsonify(response='success')

@app.route('/api/experiences', methods=['GET'])
@require_login()
def get_user_experiences():
    experiences = select_from_table("experience")
    if len(experiences) == 0:
        return abort(404)

    return jsonify(data=serialize_table(experiences[0].cursor_description, experiences))


@app.route('/api/experience', methods=['POST'])
@require_login()
def create_experience():

    idexperience = request.json['idexperience']

    if idexperience is None:
        stmt = insert_from_request("experience",request)
    else:
        stmt = update_from_request("experience", request)

    cursor.execute(stmt)
    cursor.commit()
    return jsonify(response='success')

@app.route('/api/projects', methods=['GET'])
@require_login()
def get_user_projects():
    SQL = "SELECT t.*, c.[name] as 'customername' FROM [project] t " \
          "LEFT JOIN [customer] c ON c.[idcustomer] = t.[customer]" \
          "INNER JOIN [profile] p ON p.[idprofile] = t.[profile] " \
          "INNER JOIN [user] u ON u.[profile] = p.[idprofile] " \
          "WHERE u.[email] = '{email}' ".format(email=session['email'])

    projects = cursor.execute(SQL).fetchall()
    if len(projects) == 0:
        return abort(404)

    return jsonify(data=serialize_table(projects[0].cursor_description, projects))

@app.route('/api/customeroptions',methods=['GET'])
@require_login()
def get_customeroptions():
    customers = cursor.execute("SELECT [idcustomer],[name] FROM [customer]").fetchall()
    return jsonify(data=serialize_table(customers[0].cursor_description, customers))

@app.route('/api/project', methods=['POST'])
@require_login()
def create_project():

    idproject = request.json['idproject']
    idcustomer = request.json['customer']

    if request.json['customername'] != '' and idcustomer is None:
        idcustomer = cursor.execute("SELECT [idcustomer] FROM [customer] WHERE [name] = '{name}'".format(
            name=request.json['customername'])).fetchone()[0]

        if idcustomer is None:
            stmt = "INSERT INTO [customer] ([name]) VALUES ('{name}')".format(name=request.json['customername'])
            cursor.execute(stmt)
            cursor.commit()
            idcustomer = cursor.execute("SELECT @@IDENTITY").fetchone()[0]


    request.json['customer'] = idcustomer

    del request.json['customername']
    if idproject is None:
        stmt = insert_from_request("project", request)
    else:
        stmt = update_from_request("project", request)

    cursor.execute(stmt)
    cursor.commit()
    return jsonify(response='success')

@app.route('/api/deleterecord', methods=['DELETE'])
@require_login()
def delete_object():
    table = request.args['table']
    idrecord = request.args['idrecord']
    print("hej")
    if table not in ['experience','workexperience','education','skill','merit','language','publication','project']:
        return abort(401)
    SQL = "DELETE FROM [{table}] WHERE [id{table}] = {idrecord}".format(table=table,idrecord=idrecord)

    cursor.execute(SQL)
    cursor.commit()
    return jsonify(reponse='success')

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

def select_from_table(table):
    SQL = "SELECT t.* FROM [{table}] t INNER JOIN [profile] p ON p.[idprofile] = t.[profile] " \
          "INNER JOIN [user] u ON u.[profile] = p.[idprofile] WHERE u.[email] = '{email}' ".format(
            table=table, email=session['email'])
    return cursor.execute(SQL).fetchall()

def update_from_request(table, request):
    data = request.json
    SQL = "UPDATE [{table}] SET ".format(table=table)
    for field in data:
        if field != "id" + table:
            if data[field] is not None:
                statement = "[{field}] = '{val}',".format(field=field,val=data[field])
            else:
                statement = "[{field}] = {val},".format(field=field,val="NULL")
            SQL = SQL + statement

    SQL = SQL[:len(SQL)-1] + " WHERE [{idfield}] = {idvalue}".format(idfield=("id"+table),idvalue=data["id"+table])

    return SQL


def insert_from_request(table, request):
    data = request.json
    idprofile = cursor.execute("SELECT [profile] FROM [user] WHERE [email] = '{email}'".format(
        email=session['email'])).fetchone()[0]
    SQL = "INSERT INTO [{table}] (".format(table=table)
    statements = ""
    for field in data:
        if field != "id" + table:
            statements = statements + ", [{field}]".format(field=field)

    SQL = SQL + statements[1:len(statements)] + ", [profile]) VALUES ("

    statements = ""
    for field in data:
        if field != "id" + table:
            if data[field] is not None:
                statements = statements + ", '{val}'".format(val=data[field])
            else:
                statements = statements + ", {val}".format(val="NULL")

    SQL = SQL + statements[1:len(statements)] + ", {profile})".format(profile=idprofile)
    return SQL

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host=host_ip, port=port)