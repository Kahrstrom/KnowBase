USE [knowbase]
GO

/****** Object:  Table [dbo].[education]    Script Date: 2015-12-21 9:34:34 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[education](
	[ideducation] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](64) NOT NULL,
	[school] [nvarchar](64) NOT NULL,
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



USE [knowbase]
GO

/****** Object:  Table [dbo].[workexperience]    Script Date: 2015-12-21 9:34:16 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

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


USE [knowbase]
GO

/****** Object:  Table [dbo].[profile]    Script Date: 2015-12-21 9:34:30 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

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
	[birthdate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[idprofile] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO


USE [knowbase]
GO

/****** Object:  Table [dbo].[tag]    Script Date: 2015-12-21 9:34:27 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

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


USE [knowbase]
GO

/****** Object:  Table [dbo].[user]    Script Date: 2015-12-21 9:34:23 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

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


USE [knowbase]
GO

/****** Object:  Table [dbo].[activity]    Script Date: 2015-12-25 19:24:26 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

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


/****** Object:  Table [dbo].[localization]    Script Date: 2015-12-25 20:28:34 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

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

GO

/****** Object:  Table [dbo].[skilltype]    Script Date: 2015-12-25 19:24:26 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

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





