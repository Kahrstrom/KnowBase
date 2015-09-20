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
