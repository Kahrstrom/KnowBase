from werkzeug import generate_password_hash, check_password_hash
from datetime import *
from app import db

import base64



# Create our database model
class Education(db.Model):
    __tablename__ = "education"

    ideducation = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(72))
    education = db.Column(db.String(72))
    school = db.Column(db.String(72))
    startdate = db.Column(db.DateTime)
    enddate = db.Column(db.DateTime)
    description = db.Column(db.String(512))
    profile = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.now())

    def __init__(self, json_data=None, profile=None):
        self.title = json_data['title']
        self.education = json_data['education']
        self.school = json_data['school']
        self.description = json_data['description']
        self.startdate = json_data['startdate']
        self.enddate = json_data['enddate']
        self.profile = profile

    def __repr__(self):
        return '<Education %r>' % (self.title)

    def update(self, json_data):
        self.title = json_data['title']
        self.education = json_data['education']
        self.school = json_data['school']
        self.description = json_data['description']
        self.startdate = json_data['startdate']
        self.enddate = json_data['enddate']

    @property
    def serialize(self):
        return {
            'ideducation': self.ideducation,
            'title': self.title,
            'education': self.education,
            'school': self.school,
            'startdate': self.startdate,
            'enddate': self.enddate,
            'description': self.description,
            'profile': self.profile,
            'timestamp': self.timestamp
        }

class WorkExperience(db.Model):
    __tablename__ = "workexperience"

    idworkexperience = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(72))
    employer = db.Column(db.String(72))
    startdate = db.Column(db.DateTime)
    enddate = db.Column(db.DateTime)
    description = db.Column(db.String(512))
    profile = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.now())

    def __init__(self, json_data=None, profile=None):
        self.title = json_data['title']
        self.employer = json_data['employer']
        self.description = json_data['description']
        self.startdate = json_data['startdate']
        self.enddate = json_data['enddate']
        self.profile = profile

    def __repr__(self):
        return '<WorkExperience %r>' % (self.title)

    def update(self, json_data):
        self.title = json_data['title']
        self.employer = json_data['employer']
        self.description = json_data['description']
        self.startdate = json_data['startdate']
        self.enddate = json_data['enddate']

    @property
    def serialize(self):
        return {
            'idworkexperience': self.idworkexperience,
            'title': self.title,
            'employer': self.employer,
            'startdate': self.startdate,
            'enddate': self.enddate,
            'description': self.description,
            'profile': self.profile,
            'timestamp': self.timestamp
        }

workExperienceProfiles = db.Table('workexperienceprofiles',
                                  db.Column('idworkexperience',db.Integer,db.ForeignKey('workexperience.idworkexperience')),
                                  db.Column('idcompetenceprofile',db.Integer,db.ForeignKey('competenceprofile.idcompetenceprofile'))

)

class Customer(db.Model):
    __tablename__ = "customer"
    idcustomer = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(72))

    def __init__(self, json_data):
        self.name = json_data['name']

    def __repr__(self):
        return '<Customer %r>' % (self.name)

    def update(self, json_data=None):
        self.name = json_data['name']

    @property
    def serialize(self):
        return {
            'idcustomer':self.idcustomer,
            'name':self.name
        }

class CompetenceProfile(db.Model):
    __tablename__ = "competenceprofile"

    idcompetenceprofile = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    workexperiences = db.relationship('WorkExperience',secondary=workExperienceProfiles,
                                      backref=db.backref('competenceprofile',lazy='dynamic'))
    profile = db.Column(db.Integer, db.ForeignKey('profile.idprofile'))
    rel_profile = db.relationship('Profile', primaryjoin='CompetenceProfile.profile == Profile.idprofile',
                                  backref=db.backref('competenceprofile',lazy='dynamic'))
    def __init__(self, json_data=None, profile=None):
        self.profile=profile
        self.name = json_data['name']

    def __repr__(self):
        return '<Experience %r>' % (self.name)

    def update(self, json_data=None):
        self.name = json_data['name']

    @property
    def serialize(self):
        return {
            "idcompetenceprofile" : self.idcompetenceprofile,
            "name" : self.name
        }

class Project(db.Model):
    __tablename__ = "project"

    idproject = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(72))
    customer = db.Column(db.Integer, db.ForeignKey('customer.idcustomer'))
    rel_customer = db.relationship('Customer', primaryjoin='Project.customer == Customer.idcustomer',
                                  backref=db.backref('project', lazy='dynamic'))

    hours = db.Column(db.Integer)
    startdate = db.Column(db.DateTime)
    enddate = db.Column(db.DateTime)
    description = db.Column(db.String(512))
    profile = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.now())

    def __init__(self, json_data=None, profile=None):
        self.name = json_data['name']
        self.customer = json_data['customer']
        self.description = json_data['description']
        self.startdate = json_data['startdate']
        self.enddate = json_data['enddate']
        self.hours = json_data['hours']
        self.profile = profile

    def __repr__(self):
        return '<Project %r>' % (self.name)

    def update(self, json_data):
        self.name = json_data['name']
        self.customer = json_data['customer']
        self.description = json_data['description']
        self.startdate = json_data['startdate']
        self.enddate = json_data['enddate']
        self.hours = json_data['hours']

    @property
    def serialize(self):
        return {
            'idproject': self.idproject,
            'name': self.name,
            'hours': self.hours,
            'customer': self.rel_customer.serialize,
            'startdate': self.startdate,
            'enddate': self.enddate,
            'description': self.description,
            'profile': self.profile,
            'timestamp': self.timestamp
        }


class Experience(db.Model):
    __tablename__ = "experience"

    idexperience = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(72))
    startdate = db.Column(db.DateTime)
    enddate = db.Column(db.DateTime)
    description = db.Column(db.String(512))
    profile = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.now())

    def __init__(self, json_data=None, profile=None):
        self.name = json_data['name']
        self.description = json_data['description']
        self.startdate = json_data['startdate']
        self.enddate = json_data['enddate']
        self.profile = profile

    def __repr__(self):
        return '<Experience %r>' % (self.name)

    def update(self, json_data):
        self.name = json_data['name']
        self.description = json_data['description']
        self.startdate = json_data['startdate']
        self.enddate = json_data['enddate']

    @property
    def serialize(self):
        return {
            'idexperience': self.idexperience,
            'name': self.name,
            'startdate': self.startdate,
            'enddate': self.enddate,
            'description': self.description,
            'profile': self.profile,
            'timestamp': self.timestamp
        }


class Language(db.Model):
    __tablename__ = "language"

    idlanguage = db.Column(db.Integer, primary_key=True)
    language = db.Column(db.String(128))
    listening = db.Column(db.String(32))
    writing = db.Column(db.String(32))
    reading = db.Column(db.String(32))
    conversation = db.Column(db.String(32))
    verbal = db.Column(db.String(32))
    profile = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.now())

    def __init__(self, json_data=None, profile=None):
        self.language = json_data['language']
        self.listening = json_data['listening']
        self.writing = json_data['writing']
        self.reading = json_data['reading']
        self.conversation = json_data['conversation']
        self.verbal = json_data['verbal']
        self.profile = profile

    def __repr__(self):
        return '<Language %r>' % (self.language)

    def update(self, json_data):
        self.language = json_data['language']
        self.listening = json_data['listening']
        self.writing = json_data['writing']
        self.reading = json_data['reading']
        self.conversation = json_data['conversation']
        self.verbal = json_data['verbal']

    @property
    def serialize(self):
        return {
            'idlanguage': self.idlanguage,
            'language': self.language,
            'listening': self.listening,
            'writing' : self.writing,
            'reading': self.reading,
            'conversation': self.conversation,
            'verbal': self.verbal,
            'profile': self.profile,
            'timestamp': self.timestamp
        }

# Create our database model
class Publication(db.Model):
    __tablename__ = "publication"

    idpublication = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(72))
    authors = db.Column(db.String(4000))
    publication = db.Column(db.String(128))
    date = db.Column(db.DateTime)
    description = db.Column(db.String(512))
    profile = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.now())

    def __init__(self, json_data=None, profile=None):
        self.title = json_data['title']
        self.authors = json_data['authors']
        self.publication = json_data['publication']
        self.description = json_data['description']
        self.date = json_data['date']
        self.profile = profile

    def __repr__(self):
        return '<Publication %r>' % (self.title)

    def update(self, json_data):
        self.title = json_data['title']
        self.authors = json_data['authors']
        self.publication = json_data['publication']
        self.description = json_data['description']
        self.date = json_data['date']

    @property
    def serialize(self):
        return {
            'idpublication': self.idpublication,
            'title': self.title,
            'authors': self.authors,
            'publication': self.publication,
            'date': self.date,
            'description': self.description,
            'profile': self.profile,
            'timestamp': self.timestamp
        }

class Skill(db.Model):
    __tablename__ = "skill"

    idskill = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(72))
    level = db.Column(db.Integer)
    description = db.Column(db.String(512))
    profile = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.now())

    def __init__(self, json_data=None, profile=None):
        self.name = json_data['name']
        self.description = json_data['description']
        self.level = json_data['level']
        self.profile = profile

    def __repr__(self):
        return '<Level %r>' % (self.name)

    def update(self, json_data):
        self.name = json_data['name']
        self.description = json_data['description']
        self.level = json_data['level']

    @property
    def serialize(self):
        return {
            'idskill': self.idskill,
            'name': self.name,
            'level': self.level,
            'description': self.description,
            'profile': self.profile,
            'timestamp': self.timestamp
        }

class Merit(db.Model):
    __tablename__ = "merit"

    idmerit = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    date = db.Column(db.DateTime)
    description = db.Column(db.String(512))
    profile = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.now())

    def __init__(self, json_data=None, profile=None):
        self.name = json_data['name']
        self.description = json_data['description']
        self.date = json_data['date']
        self.profile = profile

    def __repr__(self):
        return '<Merit %r>' % (self.name)

    def update(self, json_data):
        self.name = json_data['name']
        self.description = json_data['description']
        self.date = json_data['date']

    @property
    def serialize(self):
        return {
            'idmerit': self.idmerit,
            'name': self.name,
            'date': self.date,
            'description': self.description,
            'profile': self.profile,
            'timestamp': self.timestamp
        }



class Profile(db.Model):
    __tablename__ = "profile"
    idprofile = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(72), default="")
    lastname = db.Column(db.String(72), default="")
    address = db.Column(db.String(128), default="")
    zipcode = db.Column(db.String(16), default="")
    city = db.Column(db.String(32), default="")
    country = db.Column(db.String(32), default="")
    phone = db.Column(db.String(16), default="")
    mobilephone = db.Column(db.String(16), default="")
    profilepicture = db.Column(db.Integer, db.ForeignKey('file.idfile'))
    rel_profilepicture = db.relationship('File', primaryjoin='Profile.profilepicture == File.idfile',
                                  backref=db.backref('profile', lazy='dynamic'))
    birthdate = db.Column(db.DateTime)

    def __init__(self, firstname=None, lastname=None, address=None, zipcode=None,
                 city=None, country=None, birthdate=None, phone=None, mobilephone=None):
        self.firstname = firstname
        self.lastname = lastname
        self.address = address
        self.zipcode = zipcode
        self.city = city
        self.country = country
        self.birthdate = birthdate
        self.phone = phone
        self.mobilephone = mobilephone

    def update(self, json_data):
        self.firstname = json_data['firstname']
        self.lastname = json_data['lastname']
        self.address = json_data['address']
        self.mobilephone = json_data['mobilephone']
        self.phone = json_data['phone']
        self.city = json_data['city']
        self.country = json_data['country']
        self.zipcode = json_data['zipcode']
        self.birthdate = json_data['birthdate']

    @property
    def serialize(self):
        return {
            'idprofile': self.idprofile,
            'firstname': self.firstname,
            'lastname': self.lastname,
            'address': self.address,
            'city': self.city,
            'zipcode': self.zipcode,
            'country': self.country,
            'mobilephone': self.mobilephone,
            'phone': self.phone,
            'birthdate': self.birthdate
        }


def count_educations(idprofile):
    return Education.query.filter_by(profile=idprofile).count()

def get_class_by_tablename(tablename):
  for c in db.Model._decl_class_registry.values():
    if hasattr(c, '__tablename__') and c.__tablename__ == tablename:
      return c

def count_table(idprofile, table):
    c = get_class_by_tablename(table)
    return c.query.filter_by(profile=idprofile).count()


def count_workexperience(idprofile):
    return WorkExperience.query.filter_by(profile=idprofile).count()

def count_language(idprofile):
    return Language.query.filter_by(profile=idprofile).count()

def count_skill(idprofile):
    return Skill.query.filter_by(profile=idprofile).count()

def count_publication(idprofile):
    return Publication.query.filter_by(profile=idprofile).count()

def count_experience(idprofile):
    return Experience.query.filter_by(profile=idprofile).count()

def count_merit(idprofile):
    return Merit.query.filter_by(profile=idprofile).count()

def get_skilltypes(idprofile):
    return [{
                'locale':'Educations',
                'name':'education',
                'order': 1,
                'count': count_table(idprofile, "education")
            },{
                'locale':'Work experience',
                'name':'workexperience',
                'order': 2,
                'count': count_table(idprofile, "workexperience")
            },{
                'locale':'Experience',
                'name':'experience',
                'order': 3,
                'count': count_table(idprofile, "experience")
            },{
                'locale':'Publications',
                'name':'publication',
                'order': 4,
                'count': count_table(idprofile, "publication")
            },{
                'locale':'Projects',
                'name':'project',
                'order': 5,
                'count': count_table(idprofile, "project")
            },{
                'locale':'Language',
                'name':'language',
                'order': 6,
                'count': count_table(idprofile, "language")
            },{
                'locale':'Merits',
                'name':'merit',
                'order': 7,
                'count': count_table(idprofile, "merit")
            },{
                'locale':'Skills',
                'name':'skill',
                'order': 8,
                'count': count_table(idprofile, "skill")
            }]



class File(db.Model):
    __tablename__ = "file"
    idfile = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.VARBINARY(None))
    extension = db.Column(db.String(72))
    filename = db.Column(db.String(72))

    @property
    def get_data(self):
        return base64.b64encode(bytes(self.data)).decode('utf8')

    def __init__(self, data=None, extension=None, filename=None):
        self.data = base64.b64decode(data)
        self.extension = extension
        self.filename = filename

    def update(self, json_data):
        self.data = json_data['data']
        self.extension = json_data['extension']
        self.filename = json_data['filename']

    @property
    def serialize(self):
        return {
            'data': self.get_data,
            'extension': self.extension,
            'filename': self.filename,
            'idfile': self.idfile
        }



class User(db.Model):
    __tablename__ = 'user'
    iduser = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128))
    password = db.Column(db.String(128))
    profile = db.Column(db.Integer, db.ForeignKey('profile.idprofile'))
    rel_profile = db.relationship('Profile', primaryjoin='User.profile == Profile.idprofile',
                                   backref=db.backref('user', lazy='dynamic'))

    def __init__(self, email, password, profile):
        self.email = email.lower()
        self.set_password(password)
        self.profile = profile

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

