from flask import Flask, render_template, request, jsonify, abort

app = Flask(__name__)

educations = [
	{
		'ideducation' : 1,
		'title' : 'Supertitel',
		'school' : 'Superskolan',
		'enddate' : '2015-01-01',
		'description' : 'Shit vilken superutbildning det var!',
		'user' : 1
	},
	{
		'ideducation' : 2,
		'title' : 'Supertitel2',
		'school' : 'Superskolan2',
		'enddate' : '2015-01-01',
		'description' : 'Shit vilken superutbildning det var igen!',
		'user' : 1
	},
	{
		'ideducation' : 3,
		'title' : 'Kass titel',
		'school' : 'Usel skola',
		'enddate' : '',
		'description' : 'urgh...!',
		'user' : 2
	}
]

@app.route('/knowledge/api/educations', methods=['GET'])
def get_educations():
	if len(educations) == 0:
		abort(404)
	return jsonify({'educations' : educations})

@app.route('/knowledge/api/educations/<int:ideducation>')
def get_education(ideducation):
	education = [education for education in educations if education['ideducation'] == ideducation]
	if len(education) == 0:
		abort(404)
	return jsonify({'education' : education})

if __name__ == '__main__':
	app.run(debug=True)