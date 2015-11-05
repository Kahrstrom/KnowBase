CREATE TABLE education(
	 ideducation BIGSERIAL PRIMARY KEY NOT NULL,
	 title CHAR(64) NOT NULL,
	 school CHAR(32) NOT NULL,
	 enddate  DATE,
	 description CHAR(512) NOT NULL,
	 "user" INT,
	 timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	 createdtime  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	 createduser INT,
	 updateduser  INT
)
drop table "user"
CREATE TABLE "user"(
	iduser BIGSERIAL PRIMARY KEY NOT NULL,
	email VARCHAR(128) NOT NULL,
	password VARCHAR(128) NOT NULL,
	profile INT
)

CREATE TABLE "profile"(
	idprofile BIGSERIAL PRIMARY KEY NOT NULL,
	firstname VARCHAR(72),
	lastname VARCHAR(72),
	address VARCHAR(128),
	zipcode VARCHAR(16),
	city VARCHAR(32),
	country VARCHAR(32),
	phone VARCHAR(16),
	cellphone VARCHAR(16),
	birthdate DATE	
)

select * from "user"