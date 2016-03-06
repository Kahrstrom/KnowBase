import config
from app import db
from models import *
from elasticsearch import Elasticsearch

db.create_all()
db.session.commit()



def delete_all():
    es = Elasticsearch()
    search_body = {
        "query": {
            "query_string": {
                "query": "*"
            }
        }
    }
    for e in es.search(body=search_body).get('hits').get('hits'):
        es.delete(index=config.db_name,doc_type=e['_type'],id=e['_id'])

def rebuild_all():
    es = Elasticsearch()
    for e in Education.query.all():
        education = e.serialize
        education['profile'] = education['profile']['idprofile']

        es.index(index="knowbase", doc_type="education", id=e.ideducation,
             body=education)

    for w in WorkExperience.query.all():
        work = w.serialize
        work['profile'] = work['profile']['idprofile']

        t = es.index(index="knowbase", doc_type="workexperience", id=w.idworkexperience,
             body=work)

    for p in Project.query.all():
        project = p.serialize
        project['profile'] = project['profile']['idprofile']

        es.index(index="knowbase", doc_type="project", id=p.idproject,
             body=project)

    for s in Skill.query.all():
        skill = s.serialize
        skill['profile'] = skill['profile']['idprofile']

        es.index(index="knowbase", doc_type="skill", id=s.idskill,
             body=skill)

    for p in Publication.query.all():
        publication = p.serialize
        publication['profile'] = publication['profile']['idprofile']

        es.index(index="knowbase", doc_type="publication", id=p.idpublication,
             body=publication)

    for m in Merit.query.all():
        merit = m.serialize
        merit['profile'] = merit['profile']['idprofile']

        es.index(index="knowbase", doc_type="merit", id=e.idmerit,
             body=merit)

    for e in Experience.query.all():
        experience = e.serialize
        experience['profile'] = experience['profile']['idprofile']

        es.index(index="knowbase", doc_type="experience", id=e.idexperience,
             body=experience)

    for l in Language.query.all():
        language = l.serialize
        language['profile'] = language['profile']['idprofile']

        es.index(index="knowbase", doc_type="language", id=e.idlanguage,
             body=language)

if __name__ == '__main__':
    #delete_all()
    rebuild_all()
