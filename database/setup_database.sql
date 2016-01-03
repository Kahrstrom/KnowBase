--DROP TABLE [education]
--DROP TABLE [profile]
--DROP TABLE [tag]
--DROP TABLE [user]
--DROP TABLE [workexperience]
--DROP TABLE [skilltype]
--DROP TABLE [localization]
--DROP TABLE [activity]
--DROP TABLE [file]
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
	[profile] [int] NULL,
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

CREATE TABLE [dbo].[project](
	[idproject] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](64) NOT NULL DEFAULT (''),
	[customer] [nvarchar](64) NOT NULL DEFAULT (''),
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

GO



CREATE TABLE [dbo].[experience](
	[idexperience] [int] IDENTITY(1,1) NOT NULL,
	[experience] [nvarchar](128) NOT NULL DEFAULT (''),
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

GO

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

GO


CREATE TABLE [dbo].[publication](
	[idpublication] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](128) NOT NULL DEFAULT (''),
	[authors] [nvarchar](4000) NOT NULL DEFAULT (''),
	[publicationdate] [datetime] NULL,
	[publication] [nvarchar] (128) NULL,
	[description] [nvarchar](512) NOT NULL DEFAULT (''),
	[profile] [int] NULL,
	[timestamp] [datetime] NULL DEFAULT (getdate()),
PRIMARY KEY CLUSTERED 
(
	[idpublication] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

GO

CREATE TABLE [dbo].[skill](
	[idskill] [int] IDENTITY(1,1) NOT NULL,
	[skill] [nvarchar](128) NOT NULL DEFAULT (''),
	[level] [int] NULL,
	[description] [nvarchar](512) NOT NULL DEFAULT (''),
	[profile] [int] NULL,
	[timestamp] [datetime] NULL DEFAULT (getdate()),
PRIMARY KEY CLUSTERED 
(
	[idskill] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

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

CREATE TABLE [dbo].[merit](
	[idmerit] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](128) NOT NULL,
	[description] [nvarchar](512) NOT NULL,
	[profile] [int] NULL,
	[timestamp] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[idmerit] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[merit] ADD  DEFAULT ('') FOR [merit]
GO

ALTER TABLE [dbo].[merit] ADD  DEFAULT ('') FOR [description]
GO

ALTER TABLE [dbo].[merit] ADD  DEFAULT (getdate()) FOR [timestamp]
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
'languages','Spr�kkunskaper','Language skills'
UNION ALL
SELECT
'skills','Nyckelkompetenser','Key competences'
UNION ALL
SELECT
'merit', '�vriga meriter', 'Other merits'



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

CREATE PROCEDURE sp_get_skilltypes 
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
