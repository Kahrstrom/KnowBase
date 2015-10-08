from werkzeug import generate_password_hash, check_password_hash
from flask.ext.sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# Create our database model
class Education(db.Model):
	__tablename__  = "education"
	ideducation = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(72))
	school = db.Column(db.String(72))
	description = db.Column(db.String(512))
	enddate = db.Column(db.DateTime)

	def __init__(self, title = None, school = None, description = None, enddate = None):
		self.title = title
		self.school = school
		self.description = description
		self.enddate = enddate

	def __repr__(self):
		return '<Education %r>' % (self.title)

	@property
	def serialize(self):
		return {
			'ideducation' : self.ideducation,
			'title' : self.title,
			'school' : self.school,
			'enddate' : self.enddate.strftime('%Y-%m-%d'),
			'description' : self.description
		}

class Profile(db.Model):
	__tablename__  = "profile"
	idprofile = db.Column(db.Integer, primary_key=True)
	firstname = db.Column(db.String(72))
	lastname = db.Column(db.String(72))
	address = db.Column(db.String(128))
	zipcode = db.Column(db.String(128))
	city = db.Column(db.String(128))
	country = db.Column(db.String(128))
	phone = db.Column(db.String(16))
	mobilephone = db.Column(db.String(16))
	# birthdate = db.Column(db.DateTime)

	def __init__(self, firstname = None, lastname = None, address = None, zipcode = None,
		city = None, country = None, birthdate = None):
		self.firstname = firstname
		self.lastname = lastname
		self.address = address
		self.zipcode = zipcode
		self.city = city
		self.country = country
		# self.birthdate = birthdate

	def update(self, json_data):
		self.firstname = json_data['firstname']
		self.lastname = json_data['lastname']
		self.address = json_data['address']
		self.mobilephone = json_data['mobilephone']
		self.phone = json_data['phone']
		self.city = json_data['city']
		self.country = json_data['country']
		self.zipcode = json_data['zipcode']

	@property
	def serialize(self):
		return {
			'idprofile' : self.idprofile,
			'firstname' : self.firstname,
			'lastname' : self.lastname,
			'address' : self.address,
			'city' : self.city,
			'zipcode' : self.zipcode,
			'country' : self.country,
			'mobilephone' : self.mobilephone,
			'phone' : self.phone
			# ,'birthdate' : self.birthdate.strftime('%Y-%m-%d')
		}


class User(db.Model):
    __tablename__ = 'user'
    iduser = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128))
    password = db.Column(db.String(128))
    profile = db.Column(db.Integer)
    

    def __init__(self, email, password):
    	self.email = email.lower()
    	self.set_password(password)

    def set_password(self, password):
    	self.password = generate_password_hash(password)

    def check_password(self, password):
    	return check_password_hash(self.password, password)