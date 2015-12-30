--DROP TABLE [education]
--DROP TABLE [profile]
--DROP TABLE [tag]
--DROP TABLE [user]
--DROP TABLE [workexperience]
GO

-- EDUCATION
CREATE TABLE [dbo].[education](
	[ideducation] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](64) NOT NULL,
	[school] [nvarchar](64) NOT NULL,
	[startdate] [datetime] NULL,
	[enddate] [datetime] NULL,
	[description] [nvarchar](512) NOT NULL,
	[profile] [int] NULL,
	[timestamp] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ideducation] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
ALTER TABLE [dbo].[education] ADD  DEFAULT ('') FOR [title]
GO
ALTER TABLE [dbo].[education] ADD  DEFAULT ('') FOR [school]
GO
ALTER TABLE [dbo].[education] ADD  DEFAULT ('') FOR [description]
GO
ALTER TABLE [dbo].[education] ADD  DEFAULT (getdate()) FOR [timestamp]
GO

-- WORKEXPERIENCE
CREATE TABLE [dbo].[workexperience](
	[idworkexperience] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](64) NOT NULL,
	[employer] [nvarchar](64) NOT NULL,
	[startdate] [datetime] NULL,
	[enddate] [datetime] NULL,
	[description] [nvarchar](4000) NOT NULL,
	[timestamp] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[idworkexperience] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[workexperience] ADD  DEFAULT ('') FOR [title]
GO
ALTER TABLE [dbo].[workexperience] ADD  DEFAULT ('') FOR [employer]
GO
ALTER TABLE [dbo].[workexperience] ADD  DEFAULT ('') FOR [description]
GO
ALTER TABLE [dbo].[workexperience] ADD  DEFAULT (getdate()) FOR [timestamp]
GO

-- PROFILE
CREATE TABLE [dbo].[profile](
	[idprofile] [int] IDENTITY(1,1) NOT NULL,
	[firstname] [nvarchar](72) NOT NULL DEFAULT (''),
	[lastname] [nvarchar](72) NULL DEFAULT (''),
	[address] [nvarchar](128) NULL DEFAULT (''),
	[zipcode] [nvarchar](16) NULL DEFAULT (''),
	[city] [nvarchar](32) NULL DEFAULT (''),
	[country] [nvarchar](32) NULL DEFAULT (''),
	[phone] [nvarchar](16) NULL DEFAULT (''),
	[mobilephone] [nvarchar](16) NULL DEFAULT (''),
	[profilepicture] [int] NULL,
	[birthdate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[idprofile] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

-- TAG
CREATE TABLE [dbo].[tag](
	[idtag] [int] IDENTITY(1,1) NOT NULL,
	[text] [nvarchar](16) NOT NULL,
	[category] [nvarchar](16) NOT NULL,
	[profile] [int] NULL,
	[timestamp] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[idtag] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
ALTER TABLE [dbo].[tag] ADD  DEFAULT ('') FOR [text]
GO
ALTER TABLE [dbo].[tag] ADD  DEFAULT ('') FOR [category]
GO
ALTER TABLE [dbo].[tag] ADD  DEFAULT (getdate()) FOR [timestamp]
GO

-- FILE
CREATE TABLE [dbo].[file](
	[idfile] [int] IDENTITY(1,1) NOT NULL,
	[filename] [nvarchar](72) NOT NULL DEFAULT (''),
	[extension] [nvarchar](72) NULL DEFAULT (''),
	[data] [varbinary](MAX) NULL,
	[timestamp] [datetime] NULL
PRIMARY KEY CLUSTERED 
(
	[idfile] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[file] ADD  DEFAULT (getdate()) FOR [timestamp]
GO

-- USER 
CREATE TABLE [dbo].[user](
	[iduser] [int] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](128) NOT NULL,
	[password] [nvarchar](128) NOT NULL,
	[profile] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[iduser] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

-- ACTIVITY
CREATE TABLE [dbo].[activity](
	[idactivity] [int] IDENTITY(1,1) NOT NULL,
	[subject] [nvarchar](128) NOT NULL,
	[text] [nvarchar](512) NOT NULL,
	[type] [int] NOT NULL,
	[profile] [int] NULL,
	[timestamp] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[idactivity] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[activity] ADD  DEFAULT (getdate()) FOR [timestamp]
GO

-- LOCALIZATION
CREATE TABLE [dbo].[localization](
	[idlocalization] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](16) NOT NULL,
	[en-us] [nvarchar](512) NOT NULL,
	[sv] [nvarchar](512) NOT NULL,
	[timestamp] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[idlocalization] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[localization] ADD  DEFAULT (getdate()) FOR [timestamp]
GO

-- SKILLTYPE
CREATE TABLE [dbo].[skilltype](
	[idskilltype] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](64) NOT NULL,
	[localization] [int] NOT NULL,
	[order] [int] NOT NULL,
	[timestamp] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[idskilltype] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[skilltype] ADD  DEFAULT (getdate()) FOR [timestamp]
GO



-- INSERT DEFAULT LOCALIZATIONS
INSERT INTO [localization]
(code, sv,[en-us])
SELECT
'educations','Utbildningar','Educations'
UNION ALL
SELECT
'workexperience','Arbetslivserfarenhet','Work experience'
UNION ALL
SELECT
'projects','Projekt','Projects'
UNION ALL
SELECT
'publications','Publikationer','Publications'
UNION ALL
SELECT
'experience','Erfarenhet','Experience'
UNION ALL
SELECT
'languages','Språkkunskaper','Language skills'
UNION ALL
SELECT
'skills','Övriga kompetenser','Other competences'



-- INSERT DEFAULT SKILLTYPES
INSERT INTO [skilltype]
(name, localization, [order])
SELECT
'education', 1, 1
UNION ALL
SELECT
'workexperience', 2, 2
UNION ALL
SELECT
'project', 3, 5
UNION ALL
SELECT
'publication', 4, 7
UNION ALL
SELECT
'experience', 5, 3
UNION ALL
SELECT
'language', 6, 6
UNION ALL
SELECT
'skill', 7, 4


-- CREATE PROFILE PICTURE
CREATE PROCEDURE sp_add_profile_picture
	-- Add the parameters for the stored procedure here
	@@data NVARCHAR(MAX),
	@@filename NVARCHAR(32),
	@@extension NVARCHAR(8),
	@@email NVARCHAR(128)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idprofile INT
	DECLARE @img VARBINARY(MAX)
	DECLARE @idfile INT
	DECLARE @data NVARCHAR(MAX) = @@data

	SELECT @img = CAST(N'' AS XML).value('xs:base64Binary(sql:variable("@data"))', 'varbinary(MAX)');
	
	SELECT @idprofile = [profile] FROM [user] WHERE [email] = @@email
	
	INSERT INTO [file]
	([data],[filename],[extension])
	VALUES
	(@img,@@filename,@@extension)

	SELECT @idfile = SCOPE_IDENTITY()
	
	UPDATE [profile] 
	SET [profilepicture] = @idfile
	WHERE [idprofile] = @idprofile

END
GO

-- GET PROFILE PICTURE
CREATE PROCEDURE sp_get_profile_picture
	-- Add the parameters for the stored procedure here
	@@email NVARCHAR(128),
	@@data NVARCHAR(MAX) OUT,
	@@extension NVARCHAR(32) OUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	DECLARE @bin VARBINARY(MAX)
	SELECT 
		@bin = f.[data],
		@@extension = f.[extension]
	FROM [file] f
	INNER JOIN [profile] p ON p.[profilepicture] = f.[idfile]
	INNER JOIN [user] u ON u.[profile] = p.[idprofile]
	WHERE u.[email] = @@email

	SELECT @@data = CAST(N'' AS XML).value('xs:base64Binary(xs:hexBinary(sql:variable("@bin")))', 'varchar(max)');
END
GO
