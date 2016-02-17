--drop table education
--drop table [language]
--drop table activity
--drop table workexperience
--drop table skill
--drop table skilltype
--drop table localization
--drop table publication
--drop table experience
--drop table tag
--drop table project
--drop table merit
USE [knowbase]

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[education]') AND [type] IN (N'U'))
BEGIN
	-- EDUCATION
	CREATE TABLE [dbo].[education](
		[ideducation] [int] IDENTITY(1,1) NOT NULL,
		[title] [nvarchar](64) NOT NULL,
		[education] [nvarchar](64) NOT NULL, 
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

	ALTER TABLE [dbo].[education] ADD  DEFAULT ('') FOR [title]
	ALTER TABLE [dbo].[education] ADD  DEFAULT ('') FOR [school]
	ALTER TABLE [dbo].[education] ADD  DEFAULT ('') FOR [description]
	ALTER TABLE [dbo].[education] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[workexperience]') AND [type] IN (N'U'))
BEGIN
	CREATE TABLE [dbo].[workexperience](
		[idworkexperience] [int] IDENTITY(1,1) NOT NULL,
		[title] [nvarchar](64) NOT NULL,
		[employer] [nvarchar](64) NOT NULL,
		[startdate] [datetime] NULL,
		[enddate] [datetime] NULL,
		[description] [nvarchar](4000) NOT NULL,
		[profile] [int] NULL,
		[timestamp] [datetime] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[idworkexperience] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]
	ALTER TABLE [dbo].[workexperience] ADD  DEFAULT ('') FOR [title]
	ALTER TABLE [dbo].[workexperience] ADD  DEFAULT ('') FOR [employer]
	ALTER TABLE [dbo].[workexperience] ADD  DEFAULT ('') FOR [description]
	ALTER TABLE [dbo].[workexperience] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO


IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[project]') AND [type] IN (N'U'))
BEGIN
	CREATE TABLE [dbo].[project](
		[idproject] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](64) NOT NULL DEFAULT (''),
		[customer] [int] NULL,
		[hours] [int] NOT NULL DEFAULT(0),
		[startdate] [datetime] NULL,
		[enddate] [datetime] NULL,
		[description] [nvarchar](512) NOT NULL DEFAULT (''),
		[profile] [int] NULL,
		[timestamp] [datetime] NULL DEFAULT (getdate()),
	PRIMARY KEY CLUSTERED 
	(
		[idproject] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]
END

GO


IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[experience]') AND [type] IN (N'U'))
BEGIN
	CREATE TABLE [dbo].[experience](
		[idexperience] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](128) NOT NULL DEFAULT (''),
		[startdate] [datetime] NULL,
		[enddate] [datetime] NULL,
		[description] [nvarchar](512) NOT NULL DEFAULT (''),
		[profile] [int] NULL,
		[timestamp] [datetime] NULL DEFAULT (getdate()),
	PRIMARY KEY CLUSTERED 
	(
		[idexperience] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]
END
GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[language]') AND [type] IN (N'U'))
BEGIN
	CREATE TABLE [dbo].[language](
		[idlanguage] [int] IDENTITY(1,1) NOT NULL,
		[language] [nvarchar](128) NOT NULL DEFAULT (''),
		[listening] [nvarchar](32) NOT NULL DEFAULT (''),
		[writing] [nvarchar](32) NOT NULL DEFAULT (''),
		[speaking] [nvarchar](32) NOT NULL DEFAULT (''),
		[profile] [int] NULL,
		[timestamp] [datetime] NULL DEFAULT (getdate()),
	PRIMARY KEY CLUSTERED 
	(
		[idlanguage] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]
END
GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[publication]') AND [type] IN (N'U'))
BEGIN
	CREATE TABLE [dbo].[publication](
		[idpublication] [int] IDENTITY(1,1) NOT NULL,
		[title] [nvarchar](128) NOT NULL DEFAULT (''),
		[authors] [nvarchar](4000) NOT NULL DEFAULT (''),
		[date] [datetime] NULL,
		[publication] [nvarchar] (128) NULL,
		[description] [nvarchar](512) NOT NULL DEFAULT (''),
		[profile] [int] NULL,
		[timestamp] [datetime] NULL DEFAULT (getdate()),
	PRIMARY KEY CLUSTERED 
	(
		[idpublication] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]
END

GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[skill]') AND [type] IN (N'U'))
BEGIN
	CREATE TABLE [dbo].[skill](
		[idskill] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](128) NOT NULL DEFAULT (''),
		[level] [int] NULL,
		[description] [nvarchar](512) NOT NULL DEFAULT (''),
		[profile] [int] NULL,
		[timestamp] [datetime] NULL DEFAULT (getdate()),
	PRIMARY KEY CLUSTERED 
	(
		[idskill] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]
END

GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[merit]') AND [type] IN (N'U'))
BEGIN
	CREATE TABLE [dbo].[merit](
		[idmerit] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](128) NOT NULL,
		[description] [nvarchar](512) NOT NULL,
		[profile] [int] NULL,
		[date] [datetime] NULL,
		[timestamp] [datetime] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[idmerit] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[merit] ADD  DEFAULT ('') FOR [name]
	ALTER TABLE [dbo].[merit] ADD  DEFAULT ('') FOR [description]
	ALTER TABLE [dbo].[merit] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[customer]') AND [type] IN (N'U'))
BEGIN
	CREATE TABLE [dbo].[customer](
		[idcustomer] [int] IDENTITY(1,1) NOT NULL,
		[name] [nvarchar](128) NOT NULL,
		[timestamp] [datetime] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[idcustomer] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[customer] ADD  DEFAULT ('') FOR [name]
	ALTER TABLE [dbo].[customer] ADD  DEFAULT (getdate()) FOR [timestamp]
END


GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[profile]') AND [type] IN (N'U'))
BEGIN
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
END

GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[profile]') AND [type] IN (N'U'))
BEGIN
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
END

GO
IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[rel_experience]') AND [type] IN (N'U'))
BEGIN

	-- CVPROFILES
	CREATE TABLE [dbo].[rel_experience](
		[idrel_experience] [int] IDENTITY(1,1) NOT NULL,
		[idfield] [int] NULL,
		[experience] [int] NULL,
		[table] [nvarchar] (64) NULL,
		[timestamp] [datetime] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[idrel_experience] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[rel_experience] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[rel_language]') AND [type] IN (N'U'))
BEGIN

	-- CVPROFILES
	CREATE TABLE [dbo].[rel_language](
		[idrel_language] [int] IDENTITY(1,1) NOT NULL,
		[idfield] [int] NULL,
		[language] [int] NULL,
		[table] [nvarchar] (64) NULL,
		[timestamp] [datetime] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[idrel_language] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[rel_language] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO


IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[rel_merit]') AND [type] IN (N'U'))
BEGIN

	-- CVPROFILES
	CREATE TABLE [dbo].[rel_merit](
		[idrel_merit] [int] IDENTITY(1,1) NOT NULL,
		[idfield] [int] NULL,
		[merit] [int] NULL,
		[table] [nvarchar] (64) NULL,
		[timestamp] [datetime] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[idrel_merit] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[rel_merit] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO


IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[rel_project]') AND [type] IN (N'U'))
BEGIN

	-- CVPROFILES
	CREATE TABLE [dbo].[rel_project](
		[idrel_project] [int] IDENTITY(1,1) NOT NULL,
		[idfield] [int] NULL,
		[project] [int] NULL,
		[table] [nvarchar] (64) NULL,
		[timestamp] [datetime] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[idrel_project] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[rel_project] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO


IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[rel_publication]') AND [type] IN (N'U'))
BEGIN

	-- CVPROFILES
	CREATE TABLE [dbo].[rel_publication](
		[idrel_publication] [int] IDENTITY(1,1) NOT NULL,
		[idfield] [int] NULL,
		[publication] [int] NULL,
		[table] [nvarchar] (64) NULL,
		[timestamp] [datetime] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[idrel_publication] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[rel_publication] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO


IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[rel_workexperience]') AND [type] IN (N'U'))
BEGIN
	-- CVPROFILES
	CREATE TABLE [dbo].[rel_workexperience](
		[idrel_workexperience] [int] IDENTITY(1,1) NOT NULL,
		[idfield] [int] NULL,
		[workexperience] [int] NULL,
		[table] [nvarchar] (64) NULL,
		[timestamp] [datetime] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[idrel_workexperience] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[rel_workexperience] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO


IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[rel_skill]') AND [type] IN (N'U'))
BEGIN
	-- CVPROFILES
	CREATE TABLE [dbo].[rel_skill](
		[idrel_skill] [int] IDENTITY(1,1) NOT NULL,
		[idfield] [int] NULL,
		[skill] [int] NULL,
		[table] [nvarchar] (64) NULL,
		[timestamp] [datetime] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[idrel_skill] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[rel_skill] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[cvprofile]') AND [type] IN (N'U'))
BEGIN

	-- CVPROFILES
	CREATE TABLE [dbo].[cvprofile](
		[idcvprofile] [int] IDENTITY(1,1) NOT NULL,
		--[education] [int] NULL,
		--[experience] [int] NULL,
		--[language] [int] NULL,
		--[merit] [int] NULL,
		--[project] [int] NULL,
		--[publication] [int] NULL,
		--[skill] [int] NULL,
		--[workexperience] [int] NULL,
		[profile] [int] NULL,
		[timestamp] [datetime] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[idcvprofile] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[cvprofile] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[rel_education]') AND [type] IN (N'U'))
BEGIN

	-- CVPROFILES
	CREATE TABLE [dbo].[rel_education](
		[idrel_education] [int] IDENTITY(1,1) NOT NULL,
		[idfield] [int] NULL,
		[education] [int] NULL,
		[table] [nvarchar] (64) NULL,
		[timestamp] [datetime] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[idrel_education] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[rel_education] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO



IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[file]') AND [type] IN (N'U'))
BEGIN
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
	ALTER TABLE [dbo].[file] ADD  DEFAULT (getdate()) FOR [timestamp]
END

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[user]') AND [type] IN (N'U'))
BEGIN
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
END

GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[activity]') AND [type] IN (N'U'))
BEGIN
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
	ALTER TABLE [dbo].[activity] ADD  DEFAULT (getdate()) FOR [timestamp]
END

GO

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[localization]') AND [type] IN (N'U'))
BEGIN
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

	ALTER TABLE [dbo].[localization] ADD  DEFAULT (getdate()) FOR [timestamp]

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
	'skills','Nyckelkompetenser','Key competences'
	UNION ALL
	SELECT
	'merit', 'Övriga meriter', 'Other merits'

END

IF  NOT EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[skilltype]') AND [type] IN (N'U'))
BEGIN
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
	ALTER TABLE [dbo].[skilltype] ADD  DEFAULT (getdate()) FOR [timestamp]
	
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
	'publication', 4, 4
	UNION ALL
	SELECT
	'experience', 5, 3
	UNION ALL
	SELECT
	'language', 6, 6
	UNION ALL
	SELECT
	'skill', 7, 8
	UNION ALL
	SELECT 
	'merit', 8, 7

END

GO


IF EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[sp_add_profile_picture]') AND [type] IN (N'P'))
BEGIN
	DROP PROCEDURE [dbo].[sp_add_profile_picture]
END

GO
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

IF EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[sp_get_skilltypes]') AND [type] IN (N'P'))
BEGIN
	DROP PROCEDURE [dbo].[sp_get_skilltypes]
END

GO

CREATE PROCEDURE [dbo].sp_get_skilltypes 
	@@locale NVARCHAR(32),
	@@email NVARCHAR(128)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @sql NVARCHAR(4000)
	DECLARE @params NVARCHAR(256)
	DECLARE @name NVARCHAR(32)
	DECLARE @count INT
	DECLARE @idprofile INT

	SELECT @idprofile = [idprofile]
	FROM [profile] 
	INNER JOIN [user] ON [profile] = [idprofile]
	WHERE [email] = @@email

	CREATE TABLE #tmp
	(
		[locale] NVARCHAR(64),
		[name] NVARCHAR(64),
		[order] INT,
		[count] INT
	)

	SET @sql = N'INSERT INTO #tmp ([locale],[name],[order]) 
	SELECT l.[' + @@locale + '], s.[name], s.[order]
	FROM [localization] l 
	INNER JOIN [skilltype] s ON s.[localization] = l.[idlocalization]'

	EXECUTE sp_executesql @sql

	DECLARE cur CURSOR LOCAL STATIC FORWARD_ONLY FOR
	SELECT [name] FROM #tmp

	OPEN cur
	FETCH NEXT FROM cur INTO @name
	WHILE @@FETCH_STATUS = 0
	BEGIN
		SET @sql = 'SELECT @count = COUNT(*) 
		FROM [' + @name + '] WHERE [profile] = @idprofile'

		SET @params = '@count AS INT OUT, @idprofile AS INT'
		EXECUTE sp_executesql @sql, @params, @count = @count OUT, @idprofile = @idprofile
		UPDATE #tmp
		SET [count] = @count
		WHERE [name] = @name
		FETCH NEXT FROM cur INTO @name
	END

	CLOSE cur
	DEALLOCATE cur
	
	SELECT * FROM #tmp
	DROP TABLE #tmp
END
GO

IF EXISTS (SELECT * FROM sys.objects 
WHERE object_id = OBJECT_ID(N'[dbo].[sp_get_profile_picture]') AND [type] IN (N'P'))
BEGIN
	DROP PROCEDURE [dbo].[sp_get_profile_picture]
END

GO

-- GET PROFILE PICTURE
CREATE PROCEDURE sp_get_profile_picture
	-- Add the parameters for the stored procedure here
	@@email NVARCHAR(128)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	DECLARE @bin VARBINARY(MAX)
	DECLARE @extension NVARCHAR(32)
	DECLARE @data NVARCHAR(MAX)
	SELECT 
		@bin = f.[data],
		@extension = f.[extension]
	FROM [file] f
	INNER JOIN [profile] p ON p.[profilepicture] = f.[idfile]
	INNER JOIN [user] u ON u.[profile] = p.[idprofile]
	WHERE u.[email] = @@email

	SELECT @data = CAST(N'' AS XML).value('xs:base64Binary(xs:hexBinary(sql:variable("@bin")))', 'varchar(max)');
	SELECT @data, @extension
END
GO
