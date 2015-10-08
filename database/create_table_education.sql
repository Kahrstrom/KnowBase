
-- Table: education

-- DROP TABLE education;



CREATE TABLE education
(
  ideducation bigserial NOT NULL,
  title character varying(64) NOT NULL,
  school character varying(32) NOT NULL,
  enddate date,
  description character varying(512) NOT NULL,
  "profile" integer,
  "timestamp" timestamp without time zone DEFAULT now(),
  CONSTRAINT education_pkey PRIMARY KEY (ideducation)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE education
  OWNER TO postgres;


-- Table: "user"

-- DROP TABLE "user";

CREATE TABLE "user"
(
  iduser bigserial NOT NULL,
  email character varying(128) NOT NULL,
  password character varying(128) NOT NULL,
  profile integer,
  CONSTRAINT user_pkey PRIMARY KEY (iduser)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "user"
  OWNER TO postgres;

-- Table: profile

-- DROP TABLE profile;

CREATE TABLE profile
(
  idprofile bigserial NOT NULL,
  firstname character varying(72),
  lastname character varying(72),
  address character varying(128),
  zipcode character varying(16),
  city character varying(32),
  country character varying(32),
  phone character varying(16),
  mobilephone character varying(16),
  birthdate date,
  CONSTRAINT profile_pkey PRIMARY KEY (idprofile)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE profile
  OWNER TO postgres;

