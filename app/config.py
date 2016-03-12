import os

db_name = os.environ['KNOWBASE_DB']
db_uid = os.environ['KNOWBASE_UID']
db_pw = os.environ['KNOWBASE_PW']
driver = "SQL+Server+Native+Client+10.0"#os.environ['KNOWBASE_DRIVER']#
server_name = os.environ['KNOWBASE_SERVER']
host_ip = os.environ['KNOWBASE_HOST']

print(host_ip)

ALLOWED_EXTENSIONS = set(['jpeg', 'jpg', 'png', 'gif'])


connection_string = "mssql+pyodbc://{uid}:{pw}@{server}/{db}?driver={driver}".format(driver=driver,
                                                                             server=server_name,
                                                                             uid=db_uid,
                                                                             pw=db_pw,
                                                                             db=db_name)
