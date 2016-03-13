from flask import Flask, request, jsonify, abort, session
from flask_sqlalchemy import SQLAlchemy
from functools import update_wrapper
from collections import defaultdict
import os
import config
import json
from elasticsearch import Elasticsearch


app = Flask(__name__)
app.secret_key = 'qwertyasdfghzxcvb'
app.config['SQLALCHEMY_DATABASE_URI'] = config.connection_string

print(app.config['SQLALCHEMY_DATABASE_URI'])

db = SQLAlchemy(app)

from models import *

db.create_all()
db.session.commit()

db.init_app(app)

def require_login():
    def decorator(fn):
        def decorated_function(*args, **kwargs):
            if 'email' not in session:
                return abort(401)
            user = User.query.filter_by(email=session['email']).first()
            if user is None:
                return abort(401)

            return fn(*args, **kwargs)

        return update_wrapper(decorated_function, fn)

    return decorator

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in config.ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return app.send_static_file('base.html')



@app.route('/api/skilltypes', methods=['GET'])
@require_login()
def skill_types():

    user = User.query.filter_by(email=session['email']).first()

    retval = get_skilltypes(user.profile)

    return jsonify(data=retval)

@app.route('/api/profilepicture', methods=['POST'])
@require_login()
def upload_profile_picture():
    extension = request.json['extension']
    data = request.json['data']

    if data and allowed_file("." + extension):
        profile = User.query.filter_by(email=session['email']).first().rel_profile
        if profile.rel_profilepicture is None:
            picture = File(data=data, extension=extension, filename='profilepicture')
            db.session.add(picture)
            db.session.commit()
            profile.profilepicture = picture.idfile
        else:
            picture = profile.rel_profilepicture
            picture.data = base64.b64decode(data)
        db.session.commit()

        #cursor.commit()

    return jsonify(response='success')

@app.route('/api/profilepicture', methods=['GET'])
@require_login()
def get_profile_picture():

    user = User.query.filter_by(email=session['email']).first()
    img = user.rel_profile.rel_profilepicture
    if img is None:
        return abort(404)
    return jsonify(img.serialize)

@app.route('/api/profile', methods=['POST'])
@require_login()
def update_profile():


    profile = User.query.filter_by(email=session['email']).first().rel_profile
    profile.update(request.json)
    db.session.commit()

    return jsonify(response='success')


@app.route('/api/login', methods=['POST'])
def login():
    json_data = request.json
    email = json_data['email']
    password = json_data['password']

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify(response=False)

    if user.check_password(password):
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

    user = User.query.filter_by(email=email).first()

    if user is not None:
        return jsonify(response='user already exists')

    profile = Profile(firstname=firstname, lastname=lastname, email=email)
    db.session.add(profile)
    db.session.commit()

    user = User(email=email, password=password, profile=profile.idprofile)
    db.session.add(user)
    db.session.commit()
    return jsonify(response='success')

@app.route('/api/profile', methods=['GET'])
@require_login()
def profile():
    idprofile = request.args.get('idprofile')
    if idprofile is None:
        profile = User.query.filter_by(email=session['email']).first().rel_profile

    else:
        profile = Profile.query.get(idprofile)

    if profile is None:
        return abort(404)

    return jsonify(data=profile.serialize)


@app.route('/api/options', methods=['GET'])
@require_login()
def get_options():
    table = request.args['table']
    field = request.args['field']

    t = get_class_by_tablename(table.lower())
    c = getattr(t,field.lower())
    query = db.session.query(c.distinct().label("option"))
    options = [{"option":row.option} for row in query.all()]
    return jsonify(data=options)

@app.route('/api/workexperience', methods=['GET'])
@require_login()
def get_user_workexperience():
    user = User.query.filter_by(email=session['email']).first()
    workexperience = WorkExperience.query.filter_by(profile=user.profile).all()
    if workexperience is None:
        return abort(404)
    retval = []
    for w in workexperience:
            retval.append(w.serialize)

    return jsonify(data=retval)

@app.route('/api/workexperience', methods=['POST'])
@require_login()
def create_workexperience():
    idworkexperience = request.json['idworkexperience']

    profile = User.query.filter_by(email=session['email']).first().rel_profile

    if idworkexperience is None:
        workexperience = WorkExperience(request.json, profile.idprofile)
        db.session.add(workexperience)
    else:
        workexperience = WorkExperience.query.get(idworkexperience)
        workexperience.update(request.json)
        
    db.session.commit()

    return jsonify(idrecord="{idrecord}".format(idrecord=workexperience.idworkexperience))

@app.route('/api/merits', methods=['GET'])
@require_login()
def get_user_merits():
    user = User.query.filter_by(email=session['email']).first()
    merits = Merit.query.filter_by(profile=user.profile).all()
    if merits is None:
        return abort(404)
    retval = []
    for m in merits:
            retval.append(m.serialize)

    return jsonify(data=retval)

@app.route('/api/merit', methods=['POST'])
@require_login()
def create_merit():
    idmerit = request.json['idmerit']
    profile = User.query.filter_by(email=session['email']).first().rel_profile

    if idmerit is None:
        merit = Merit(request.json, profile.idprofile)
        db.session.add(merit)
    else:
        merit = Merit.query.get(idmerit)
        merit.update(request.json)
        
    db.session.commit()

    return jsonify(idrecord="{idrecord}".format(idrecord=merit.idmerit))

@app.route('/api/educations', methods=['GET'])
@require_login()
def get_user_educations():
    user = User.query.filter_by(email=session['email']).first()
    educations = Education.query.filter_by(profile=user.profile).all()
    if educations is None:
        return abort(404)
    retval = []
    for edu in educations:
            retval.append(edu.serialize)
    print(retval)
    return jsonify(data=retval)


@app.route('/api/education', methods=['POST'])
@require_login()
def update_education():

    ideducation = request.json['ideducation']
    profile = User.query.filter_by(email=session['email']).first().rel_profile

    if ideducation is None:
        education = Education(request.json, profile.idprofile)
        db.session.add(education)

    else:
        education = Education.query.get(ideducation)
        education.update(request.json)

    db.session.commit()

    return jsonify(idrecord="{idrecord}".format(idrecord=education.ideducation))


@app.route('/api/skills', methods=['GET'])
@require_login()
def get_user_skills():
    user = User.query.filter_by(email=session['email']).first()
    skills = Skill.query.filter_by(profile=user.profile).all()
    if skills is None:
        return abort(404)
    retval = []
    for s in skills:
            retval.append(s.serialize)

    return jsonify(data=retval)


@app.route('/api/skill', methods=['POST'])
@require_login()
def update_skill():

    idskill = request.json['idskill']
    profile = User.query.filter_by(email=session['email']).first().rel_profile

    if idskill is None:
        skill = Skill(request.json, profile.idprofile)
        db.session.add(skill)
    else:
        skill = Skill.query.get(idskill)
        skill.update(request.json)

    db.session.commit()

    return jsonify(idrecord="{idrecord}".format(idrecord=skill.idskill))

@app.route('/api/experiences', methods=['GET'])
@require_login()
def get_user_experiences():
    user = User.query.filter_by(email=session['email']).first()
    experiences = Experience.query.filter_by(profile=user.profile).all()

    if experiences is None:
        return abort(404)
    retval = []
    for e in experiences:
            retval.append(e.serialize)

    return jsonify(data=retval)


@app.route('/api/experience', methods=['POST'])
@require_login()
def update_experience():
    idexperience = request.json['idexperience']
    profile = User.query.filter_by(email=session['email']).first().rel_profile

    if idexperience is None:
        experience = Experience(request.json, profile.idprofile)
        db.session.add(experience)
    else:
        experience = Experience.query.get(idexperience)
        experience.update(request.json)
        
    db.session.commit()

    return jsonify(idrecord="{idrecord}".format(idrecord=experience.idexperience))

@app.route('/api/languages', methods=['GET'])
@require_login()
def get_languages():
    user = User.query.filter_by(email=session['email']).first()
    languages = Language.query.filter_by(profile=user.profile).all()
    if languages is None:
        return abort(404)
    retval = []
    for l in languages:
            retval.append(l.serialize)

    return jsonify(data=retval)


@app.route('/api/language', methods=['POST'])
@require_login()
def update_language():
    idlanguage = request.json['idlanguage']

    profile = User.query.filter_by(email=session['email']).first().rel_profile

    if idlanguage is None:
        language = Language(request.json, profile.idprofile)
        db.session.add(language)

    else:
        language = Language.query.get(idlanguage)
        language.update(request.json)
        
    db.session.commit()

    return jsonify(idrecord="{idrecord}".format(idrecord=language.idlanguage))

@app.route('/api/publications', methods=['GET'])
@require_login()
def get_user_publications():
    user = User.query.filter_by(email=session['email']).first()
    publications = Publication.query.filter_by(profile=user.profile).all()
    if publications is None:
        return abort(404)
    retval = []
    for p in publications:
        retval.append(p.serialize)

    return jsonify(data=retval)


@app.route('/api/publication', methods=['POST'])
@require_login()
def create_publication():
    idpublication = request.json['idpublication']
    profile = User.query.filter_by(email=session['email']).first().rel_profile

    if idpublication is None:
        publication = Publication(request.json, profile.idprofile)
        db.session.add(publication)
    else:
        publication = Publication.query.get(idpublication)
        publication.update(request.json)
        
    db.session.commit()

    return jsonify(idrecord="{idrecord}".format(idrecord=publication.idpublication))

@app.route('/api/projects', methods=['GET'])
@require_login()
def get_user_projects():
    user = User.query.filter_by(email=session['email']).first()
    projects = Project.query.filter_by(profile=user.profile).all()
    if projects is None:
        return abort(404)
    retval = []
    for p in projects:
            retval.append(p.serialize)

    return jsonify(data=retval)

@app.route('/api/customers',methods=['GET'])
@require_login()
def get_customeroptions():
    customers = Customer.query.all()
    retval = []
    for c in customers:
        retval.append(c.serialize)
    return jsonify(data=retval)

@app.route('/api/competenceprofiles',methods=['GET'])
@require_login()
def get_competenceprofiles():
    #TODO: kontrollera admin
    idprofile = request.args.get('idprofile')
    if idprofile is None:
        profile = User.query.filter_by(email=session['email']).first().rel_profile
    else:
        profile = Profile.query.get(idprofile)

    if profile is None:

        return abort(401)

    profiles = CompetenceProfile.query.filter_by(profile=profile.idprofile).all()

    retval = []
    for p in profiles:

        retval.append(p.serialize)


    return jsonify(data=retval)

@app.route('/api/competenceProfile',methods=['POST'])
@require_login()
def save_competenceprofiles():

    profile = User.query.filter_by(email=session['email']).first().rel_profile
    experiences = request.json['experiences']
    publications = request.json['publications']
    projects = request.json['projects']
    educations = request.json['educations']
    workExperiences = request.json['workExperiences']
    languages = request.json['languages']
    skills = request.json['skills']
    merits = request.json['merits']
    idcompetenceprofile = request.json['idcompetenceprofile']
    if idcompetenceprofile is None:
        competenceProfile = CompetenceProfile(request.json['name'],profile.idprofile)
        db.session.add(competenceProfile)
        db.session.commit()
    else:
        competenceProfile = CompetenceProfile.query.get(idcompetenceprofile)
        competenceProfile.name = request.json['name']

    competenceProfile.workexperiences = [WorkExperience.query.get(w['idworkexperience'])  for w in workExperiences]
    competenceProfile.educations = [Education.query.get(e['ideducation'])  for e in educations]
    competenceProfile.experiences = [Experience.query.get(e['idexperience'])  for e in experiences]
    competenceProfile.skills = [Skill.query.get(s['idskill'])  for s in skills]
    competenceProfile.publications = [Publication.query.get(p['idpublication'])  for p in publications]
    competenceProfile.languages = [Language.query.get(l['idlanguage'])  for l in languages]
    competenceProfile.projects = [Project.query.get(p['idproject'])  for p in projects]
    competenceProfile.merits = [Merit.query.get(m['idmerit'])  for m in merits]

    db.session.commit()
    return jsonify(idrecord="{idrecord}".format(idrecord=competenceProfile.idcompetenceprofile))

@app.route('/api/project', methods=['POST'])
@require_login()
def create_project():

    idproject = request.json['idproject']
    profile = User.query.filter_by(email=session['email']).first().rel_profile

    customer = request.json['customer']

    if customer is None:
        customer = Customer({'name' : request.json['customername']})
        db.session.add(customer)
        db.session.commit()
    else:
        customer = Customer.query.get(customer['idcustomer'])


    if idproject is None:
        project = Project(request.json,profile.idprofile)
        project.customer = customer.idcustomer
        db.session.add(project)

        db.session.commit()


    else:
        project = Project.query.get(idproject)
        project.update(request.json)
        db.session.commit()



    return jsonify(idrecord="{idrecord}".format(idrecord=idproject))

@app.route('/api/deleterecord', methods=['DELETE'])
@require_login()
def delete_object():
    table = request.args['table']
    idrecord = request.args['idrecord']
    record = get_class_by_tablename(table)
    db.session.delete(record.query.get(idrecord))
    db.session.commit()
    return jsonify(response='success')

@app.route('/api/search', methods=['POST'])
def search():
    data = request.json['query']

    if len(data) < 2:
        print("fsdfsd")
        return jsonify({})

    res = SearchResult()
    profiles = defaultdict(dict)
    es = Elasticsearch()
    search_body = {
        "from": 0,
        "size": 10,
        "query": {
            "query_string": {
                "query": "*" + data + "*"
            }
        }
    }

    for e in es.search(body=search_body).get('hits').get('hits'):
        src = e.get('_source')

        if e.get('_type') == 'education':
            education = Education.query.get(src['ideducation'])
            #profiles[education.profile]['educations'].append(education.serialize)
            res.educations.append(education.serialize)
        if e.get('_type') == 'skill':
            skill = Skill.query.get(src['idskill'])
            res.skills.append(skill.serialize)
        if e.get('_type') == 'language':
            language = Language.query.get(src['idlanguage'])
            res.languages.append(language.serialize)
        if e.get('_type') == 'merit':
            merit = Merit.query.get(src['idmerit'])
            res.merits.append(merit.serialize)
        if e.get('_type') == 'publication':
            publication = Publication.query.get(src['idpublication'])
            res.publications.append(publication.serialize)
        if e.get('_type') == 'experience':
            experience = Experience.query.get(src['idexperience'])
            res.experiences.append(experience.serialize)
        if e.get('_type') == 'workexperience':
            workexperience = WorkExperience.query.get(src['idworkexperience'])
            res.workexperiences.append(workexperience.serialize)
        if e.get('_type') == 'project':
            project = Project.query.get(src['idproject'])
            res.projects.append(project.serialize)

    return jsonify(res.serialize)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host=config.host_ip, port=port, debug=False)
