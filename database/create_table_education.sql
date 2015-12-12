
-- Table: education

-- DROP TABLE education;



CREATE TABLE education
(
  [ideducation] INT NOT NULL PRIMARY KEY,
  [title] NVARCHAR(64) NOT NULL,
  [school] NVARCHAR(64) NOT NULL,
  [enddate] DATETIME,
  [description] NVARCHAR(512) NOT NULL,
  [profile] INTEGER,
  [timestamp] DATETIME DEFAULT GETDATE()
)

CREATE TABLE [user]
(
  iduser INT NOT NULL PRIMARY KEY,
  email NVARCHAR(128) NOT NULL,
  [password] NVARCHAR(128) NOT NULL,
  [profile] integer
)


CREATE TABLE profile
(
  idprofile INTEGER NOT NULL PRIMARY KEY,
  firstname NVARCHAR(72),
  lastname NVARCHAR(72),
  address NVARCHAR(128),
  zipcode NVARCHAR(16),
  city NVARCHAR(32),
  country NVARCHAR(32),
  phone NVARCHAR(16),
  mobilephone NVARCHAR(16),
  birthdate DATETIME
)
