from flask import Flask, render_template, request, jsonify, abort, session, redirect, url_for
from models import db, User, Education, Profile
from functools import update_wrapper


app = Flask(__name__)
app.secret_key = 'devkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://test_user:pass@localhost:5432/knowledge_test'
db.init_app(app)

def require_login():
	def decorator(fn):
		def decorated_function(*args, **kwargs):
			if 'email' not in session:
			    return abort(401)
			user = User.query.filter_by(email = session['email']).first()
			if user is None:
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
	user = User.query.filter(User.email == session['email']);
	if user.count() == 0:
		return abourt(404)
	
	profile = Profile.query.filter(Profile.idprofile == user.first().profile)
	if profile.count() == 0:
		profile = Profile()
		db.session.add(profile)
		db.session.commit()
		user.first().profile = profile.idprofile
		db.session.commit()
	return jsonify(data=profile.first().serialize)


@app.route('/api/profile', methods=['POST'])
@require_login()
def update_profile():
	user = User.query.filter(User.email == session['email']);

	idprofile = user.first().profile
	profile = Profile.query.filter(Profile.idprofile == idprofile)

	if profile.count() == 0:
		return abort(404)
	
	profile.update(request.json)
	db.session.commit()
	return jsonify(response='success')


@app.route('/api/login', methods=['POST'])
def login():
	json_data = request.json
	email = json_data['email']
	password = json_data['password']
	user = User.query.filter(User.email == email.lower())

	if user.count() == 0:
		return jsonify(response=False)

	if user.first().check_password(password):
		session['email'] = email
		return jsonify(response=True)
	
	return jsonify(response=False)

@app.route('/api/logout', methods=['GET'])
def logout():
	session.pop('email',None)
	return jsonify(response='success')


@app.route('/api/signup', methods=['POST'])
def signup():
	json_data = request.json
	email = json_data['email']
	password = json_data['password']

	if User.query.filter(User.email == email.lower()).count() > 0:
		return jsonify(response='user already exists')

	reg = User(email, password)
	db.session.add(reg)
	db.session.commit()

	return jsonify(response='success')


@app.route('/api/educations', methods=['GET'])
@require_login()
def get_user_educations():
	profile = Profile.query.join(user).filter(user.iduser == profile.user).filter(user.email == session['email'])

	if profile.count() == 0:
		return abort(401)
	return jsonify(educations=[e.serialize for e in Education.query.all()])


@app.route('/api/educations/<int:ideducation>', methods=['GET'])
@require_login()
def get_education(ideducation):
	education = Education.query.filter(Education.ideducation == ideducation)
	if education.count() == 0:
		abort(404)
	return jsonify(education=education.first().serialize)


@app.route('/api/educations', methods=['POST'])
@require_login()
def create_education():
	if not request.json or not 'title' in request.json:
		abort(400)
	education = {
		'title' : request.json['title'],
		'school' : request.json['school'],
		'enddate' : request.json['enddate'],
		'description' : request.json['description']
	}
	return jsonify(education=education)


	

if __name__ == '__main__':
	app.run(debug=True)