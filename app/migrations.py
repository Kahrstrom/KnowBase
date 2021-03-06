from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import config
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from datetime import *

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = config.connection_string
print(app.config['SQLALCHEMY_DATABASE_URI'])

db = SQLAlchemy(app)
migrate = Migrate(app,db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)


workExperienceProfiles = db.Table('workexperienceprofiles',
      db.Column('idworkexperience',db.Integer,db.ForeignKey('workexperience.idworkexperience')),
      db.Column('idcompetenceprofile',db.Integer,db.ForeignKey('competenceprofile.idcompetenceprofile'))
)

educationProfiles = db.Table('educationprofiles',
      db.Column('ideducation',db.Integer,db.ForeignKey('education.ideducation')),
      db.Column('idcompetenceprofile',db.Integer,db.ForeignKey('competenceprofile.idcompetenceprofile'))
)

skillProfiles = db.Table('skillprofiles',
      db.Column('idskill',db.Integer,db.ForeignKey('skill.idskill')),
      db.Column('idcompetenceprofile',db.Integer,db.ForeignKey('competenceprofile.idcompetenceprofile'))
)

languageProfiles = db.Table('languageprofiles',
      db.Column('idlanguage',db.Integer,db.ForeignKey('language.idlanguage')),
      db.Column('idcompetenceprofile',db.Integer,db.ForeignKey('competenceprofile.idcompetenceprofile'))
)

projectProfiles = db.Table('projectprofiles',
      db.Column('idproject',db.Integer,db.ForeignKey('project.idproject')),
      db.Column('idcompetenceprofile',db.Integer,db.ForeignKey('competenceprofile.idcompetenceprofile'))
)

experienceProfiles = db.Table('experienceprofiles',
      db.Column('idexperience',db.Integer,db.ForeignKey('experience.idexperience')),
      db.Column('idcompetenceprofile',db.Integer,db.ForeignKey('competenceprofile.idcompetenceprofile'))
)

meritProfiles = db.Table('meritprofiles',
      db.Column('ideducidmeritation',db.Integer,db.ForeignKey('merit.idmerit')),
      db.Column('idcompetenceprofile',db.Integer,db.ForeignKey('competenceprofile.idcompetenceprofile'))
)

publicationProfiles = db.Table('publicationprofiles',
      db.Column('idpublication',db.Integer,db.ForeignKey('publication.idpublication')),
      db.Column('idcompetenceprofile',db.Integer,db.ForeignKey('competenceprofile.idcompetenceprofile'))
)

class ResourceRequest(db.Model):
    __tablename__ = "resourcerequest"
    idresourcerequest = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(72))
    startdate = db.Column(db.DateTime)
    enddate = db.Column(db.DateTime)
    description = db.Column(db.String(4000))
    externallink = db.Column(db.String(72))
    customer = db.Column(db.Integer, db.ForeignKey('customer.idcustomer'))
    rel_customer = db.relationship('Customer', primaryjoin='ResourceRequest.customer == Customer.idcustomer',
                                  backref=db.backref('resourcerequest', lazy='dynamic'))
    contactname = db.Column(db.String(128))
    contactemail = db.Column(db.String(128))

    def __init__(self, json_data=None):
        self.title = json_data['title']
        self.title = json_data['title']
        self.startdate = json_data['startdate']
        self.enddate = json_data['enddate']
        self.description = json_data['description']
        self.externallink = json_data['externallink']
        self.contactname = json_data['contactname']
        self.contactemail = json_data['contactemail']

    def __repr__(self):
        return '<ResourceRequest %r>' % (self.title)

    def update(self, json_data):
        self.title = json_data['title']
        self.title = json_data['title']
        self.startdate = json_data['startdate']
        self.enddate = json_data['enddate']
        self.description = json_data['description']
        self.externallink = json_data['externallink']
        self.contactname = json_data['contactname']
        self.contactemail = json_data['contactemail']
        self.customer = json_data['customer']['idcustomer']

    @property
    def serialize_customer(self):
        if self.rel_customer is not None:
            return self.rel_customer.serialize
        else:
            return ''

    @property
    def serialize(self):
        return {
            'idresourcerequest' : self.idresourcerequest,
            'title' : self.title,
            'startdate' : self.startdate,
            'enddate' : self.enddate,
            'description' : self.description,
            'externallink' : self.externallink,
            'customer' : self.serialize_customer,
            'contactname' : self.contactname,
            'contactemail' : self.contactemail,
            'descriptive_header': self.serialize_customer['descriptive_header'] + ' - ' + self.title,
            'descriptive_subheader': self.description
        }


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
    profile = db.Column(db.Integer, db.ForeignKey('profile.idprofile'))
    rel_profile = db.relationship('Profile', primaryjoin='Education.profile == Profile.idprofile',
                                  backref=db.backref('education', lazy='dynamic'))
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
            'profile': self.rel_profile.serialize,
            'timestamp': self.timestamp,
            'descriptive_header': self.title + ' - ' + self.education,
            'descriptive_subheader': self.school
        }

class WorkExperience(db.Model):
    __tablename__ = "workexperience"

    idworkexperience = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(72))
    employer = db.Column(db.String(72))
    startdate = db.Column(db.DateTime)
    enddate = db.Column(db.DateTime)
    description = db.Column(db.String(512))
    profile = db.Column(db.Integer, db.ForeignKey('profile.idprofile'))
    rel_profile = db.relationship('Profile', primaryjoin='WorkExperience.profile == Profile.idprofile',
                                  backref=db.backref('workexperience', lazy='dynamic'))
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
            'profile': self.rel_profile.serialize,
            'timestamp': self.timestamp,
            'descriptive_header': self.title,
            'descriptive_subheader': self.employer
        }

class Candidate(db.Model):
    __tablename__ = "candidate"
    idcandidate = db.Column(db.Integer, primary_key=True)
    rate = db.Column(db.Integer)
    approved = db.Column(db.Integer)

    competenceprofile = db.Column(db.Integer, db.ForeignKey('competenceprofile.idcompetenceprofile'))
    rel_competenceprofile = db.relationship('CompetenceProfile', primaryjoin='Candidate.competenceprofile == CompetenceProfile.idcompetenceprofile',
                                  backref=db.backref('candidate', lazy='dynamic'))

    resourcerequest = db.Column(db.Integer, db.ForeignKey('resourcerequest.idresourcerequest'))
    rel_resourcerequest = db.relationship('ResourceRequest', primaryjoin='Candidate.resourcerequest == ResourceRequest.idresourcerequest',
                                  backref=db.backref('candidate', lazy='dynamic'))

    def __init__(self, json_data):
        self.approved = 0

    def __repr__(self):
        return '<Candidate %r>' % (self.rel_competenceprofile.profile.serialize['descriptive_header'])

    def update(self, json_data=None):
        self.rate = json_data['rate']
        self.approved = json_data['approved']

    @property
    def serialize_competenceprofile(self):
        if self.rel_competenceprofile is not None:
            return self.rel_competenceprofile.serialize
        else:
            return ''

    @property
    def serialize_resourcerequest(self):
        if self.rel_resourcerequest is not None:
            return self.rel_resourcerequest.serialize
        else:
            return ''
    @property
    def serialize(self):
        return {
            'idcustomer':self.idcustomer,
            'approved':self.approved,
            'rate' : self.rate,
            'competenceprofile' : self.serialize_competenceprofile,
            'resourcerequest' : self.serialize_resourcerequest,
            'descriptive_header': self.rel_competenceprofile.profile.serialize['descriptive_header'],
            'descriptive_subheader': self.rel_competenceprofile.profile.serialize['descriptive_subheader']
        }


class Customer(db.Model):
    __tablename__ = "customer"
    idcustomer = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(72))
    customerno = db.Column(db.String(32))
    #TODO: Relation to request

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
            'name':self.name,
            'descriptive_header': self.name,
            'descriptive_subheader': ''
        }

class CompetenceProfile(db.Model):
    __tablename__ = "competenceprofile"

    idcompetenceprofile = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    description = db.Column(db.String(4000))
    #TODO: Tags!

    workexperiences = db.relationship('WorkExperience',secondary=workExperienceProfiles,
                                      backref=db.backref('competenceprofile',lazy='dynamic'))
    educations = db.relationship('Education',secondary=educationProfiles,
                                      backref=db.backref('competenceprofile',lazy='dynamic'))
    experiences = db.relationship('Experience',secondary=experienceProfiles,
                                      backref=db.backref('competenceprofile',lazy='dynamic'))
    publications = db.relationship('Publication',secondary=publicationProfiles,
                                      backref=db.backref('competenceprofile',lazy='dynamic'))
    skills = db.relationship('Skill',secondary=skillProfiles,
                                      backref=db.backref('competenceprofile',lazy='dynamic'))
    merits = db.relationship('Merit',secondary=meritProfiles,
                                      backref=db.backref('competenceprofile',lazy='dynamic'))
    projects = db.relationship('Project',secondary=projectProfiles,
                                      backref=db.backref('competenceprofile',lazy='dynamic'))
    languages = db.relationship('Language',secondary=languageProfiles,
                                      backref=db.backref('competenceprofile',lazy='dynamic'))
    profile = db.Column(db.Integer, db.ForeignKey('profile.idprofile'))
    rel_profile = db.relationship('Profile', primaryjoin='CompetenceProfile.profile == Profile.idprofile',
                                  backref=db.backref('competenceprofile',lazy='dynamic'))
    def __init__(self, json_data=None, profile=None):
        self.profile=profile
        self.name = json_data['name']
        self.description = json_data['description']

    def __repr__(self):
        return '<Experience %r>' % (self.name)

    def update(self, json_data=None):
        self.name = json_data['name']
        self.description = json_data['description']

    @property
    def serialize(self):
        return {
            "idcompetenceprofile":self.idcompetenceprofile,
            "name":self.name,
            "workexperiences":[w.serialize for w in self.workexperiences],
            "educations":[e.serialize for e in self.educations],
            "languages":[l.serialize for l in self.languages],
            "skills":[s.serialize for s in self.skills],
            "experiences":[e.serialize for e in self.experiences],
            "projects":[p.serialize for p in self.projects],
            "merits":[m.serialize for m in self.merits],
            "publications":[p.serialize for p in self.publications],
            'description' : self.description,
            'descriptive_header': self.name,
            'descriptive_subheader': self.description
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
    profile = db.Column(db.Integer, db.ForeignKey('profile.idprofile'))
    rel_profile = db.relationship('Profile', primaryjoin='Project.profile == Profile.idprofile',
                                  backref=db.backref('project', lazy='dynamic'))
    timestamp = db.Column(db.DateTime, default=datetime.now())

    def __init__(self, json_data=None, profile=None):
        self.name = json_data['name']
        self.description = json_data['description']
        self.startdate = json_data['startdate']
        self.enddate = json_data['enddate']
        self.hours = json_data['hours']
        self.profile = profile

    def __repr__(self):
        return '<Project %r>' % (self.name)

    def update(self, json_data):
        self.name = json_data['name']
        self.customer = json_data['customer']['idcustomer']
        self.description = json_data['description']
        self.startdate = json_data['startdate']
        self.enddate = json_data['enddate']
        self.hours = json_data['hours']

    @property
    def serialize_customer(self):
        if self.rel_customer is not None:
            return self.rel_customer.serialize
        else:
            return ''

    @property
    def serialize(self):
        return {
            'idproject': self.idproject,
            'name': self.name,
            'hours': self.hours,
            'customer': self.serialize_customer,
            'startdate': self.startdate,
            'enddate': self.enddate,
            'description': self.description,
            'profile': self.rel_profile.serialize,
            'timestamp': self.timestamp,
            'descriptive_header': self.name,
            'descriptive_subheader': self.serialize_customer['name']
        }


class Experience(db.Model):
    __tablename__ = "experience"

    idexperience = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(72))
    startdate = db.Column(db.DateTime)
    enddate = db.Column(db.DateTime)
    description = db.Column(db.String(512))
    profile = db.Column(db.Integer, db.ForeignKey('profile.idprofile'))
    rel_profile = db.relationship('Profile', primaryjoin='Experience.profile == Profile.idprofile',
                                  backref=db.backref('experience', lazy='dynamic'))
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
            'profile': self.rel_profile.serialize,
            'timestamp': self.timestamp,
            'descriptive_header': self.name,
            'descriptive_subheader': self.description
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
    profile = db.Column(db.Integer, db.ForeignKey('profile.idprofile'))
    rel_profile = db.relationship('Profile', primaryjoin='Language.profile == Profile.idprofile',
                                  backref=db.backref('language', lazy='dynamic'))
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
            'writing':self.writing,
            'reading': self.reading,
            'conversation': self.conversation,
            'verbal': self.verbal,
            'profile': self.rel_profile.serialize,
            'timestamp': self.timestamp,
            'descriptive_header': self.language,
            'descriptive_subheader': ''
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
    profile = db.Column(db.Integer, db.ForeignKey('profile.idprofile'))
    rel_profile = db.relationship('Profile', primaryjoin='Publication.profile == Profile.idprofile',
                                  backref=db.backref('publication', lazy='dynamic'))
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
            'profile': self.rel_profile.serialize,
            'timestamp': self.timestamp,
            'descriptive_header': self.title,
            'descriptive_subheader': self.description
        }

class Skill(db.Model):
    __tablename__ = "skill"

    idskill = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(72))
    level = db.Column(db.Integer)
    description = db.Column(db.String(512))
    profile = db.Column(db.Integer, db.ForeignKey('profile.idprofile'))
    rel_profile = db.relationship('Profile', primaryjoin='Skill.profile == Profile.idprofile',
                                  backref=db.backref('skill', lazy='dynamic'))
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
            'profile': self.rel_profile.serialize,
            'timestamp': self.timestamp,
            'descriptive_header': self.name,
            'descriptive_subheader': self.description
        }

class Merit(db.Model):
    __tablename__ = "merit"

    idmerit = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    date = db.Column(db.DateTime)
    description = db.Column(db.String(512))
    profile = db.Column(db.Integer, db.ForeignKey('profile.idprofile'))
    rel_profile = db.relationship('Profile', primaryjoin='Merit.profile == Profile.idprofile',
                                  backref=db.backref('merit', lazy='dynamic'))
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
            'profile': self.rel_profile.serialize,
            'timestamp': self.timestamp,
            'descriptive_header': self.name,
            'descriptive_subheader': self.description
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
    email = db.Column(db.String(128), default="")
    position = db.Column(db.String(128), default="")
    description = db.Column(db.String(4000), default="")
    phone = db.Column(db.String(16), default="")
    mobilephone = db.Column(db.String(16), default="")
    profilepicture = db.Column(db.Integer, db.ForeignKey('file.idfile'))
    rel_profilepicture = db.relationship('File', primaryjoin='Profile.profilepicture == File.idfile',
                                  backref=db.backref('profile', lazy='dynamic'))
    birthdate = db.Column(db.DateTime)

    def __init__(self, firstname=None, lastname=None, address=None, zipcode=None,
                 city=None, country=None, birthdate=None, phone=None, mobilephone=None, email=None, position=None,
                  description=None):
        self.firstname = firstname
        self.lastname = lastname
        self.address = address
        self.zipcode = zipcode
        self.city = city
        self.country = country
        self.birthdate = birthdate
        self.phone = phone
        self.mobilephone = mobilephone
        self.email = email
        self.position = position
        self.description = description

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
        self.position= json_data['position']
        self.description= json_data['description']

    @property
    def serialize_profilepicture(self):
        if self.rel_profilepicture is not None:
            return self.rel_profilepicture.serialize
        else:
            return ""
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
            'birthdate': self.birthdate,
            'profilepicture' : self.serialize_profilepicture,
            'email' : self.email,
            'position' : self.position,
            'description' : self.description,
            'descriptive_header': self.firstname + ' ' + self.lastname,
            'descriptive_subheader': self.position
        }


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

    def generate_auth_token(self, expiration = 86400):
        try:
            s = Serializer(config.secret_key, expires_in = expiration)
        except Exception as err:
            print(err)
        return s.dumps({ 'iduser': self.iduser })

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(config.secret_key)
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None # valid token, but expired
        except BadSignature:
            return None # invalid token
        user = User.query.get(data['iduser'])
        return user


if __name__ == '__main__':
    manager.run()