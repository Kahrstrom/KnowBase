USE [knowbase]


INSERT INTO [education]
([description],[education],[title],[profile],[school],[startdate],[enddate])
SELECT 'Cool education on a good school.','Engineering Mechanics','Master''s degree',1 ,'Some school', '2007-08-01','2012-06-01'
UNION ALL
SELECT 'Nice, but not as nice as mechanics?','Bachelor''s degree','Economics',1 ,'Some other school', '2003-08-01','2006-06-01'

INSERT INTO [workexperience]
([title],[employer],[startdate],[enddate],[description],[profile])
SELECT 'CRM consultant', 'Lundalogik', '2012-06-01', NULL, 'Awesome job. Awesome employer.',1
UNION ALL
SELECT 'Junior developer', 'Apsis', '2011-06-01', '2012-06-01', 'Part time job during studies',1


INSERT INTO [language]
([name],[listening],[reading],[writing],[conversation],[verbal],[profile])
SELECT 'English', 'C2','C2','C2','C1','C1',1
UNION ALL
SELECT 'Swedish', 'C2','C2','C2','C2','C2',1


INSERT INTO [experience]
([name],[startdate],[enddate],[description],[profile])
SELECT 'Volunteering work','2006-06-10','2007-01-01','Did some volunteering on the moon. Was nice.',1

INSERT INTO [customer]
([name])
SELECT 'BMW Financial Services'
UNION ALL
SELECT 'Trafikverket'
UNION ALL 
SELECT 'AXIS Communications'
UNION ALL
SELECT 'Ericsson'



INSERT INTO [project]
([name],[customer],[hours],[startdate],[enddate],[description],[profile])
SELECT 'CRM implementation', 1, 200, '2013-06-01','2013-09-01','Did some integrations and stuff.',1
UNION ALL
SELECT 'Web service programming',2, 120, '2013-10-05','2013-12-21','Did some web service coding.',1
UNION ALL
SELECT '3D movie image analysis',3, 800, '2012-05-01','2012-11-15','Created a surveillance system using 3D cameras in retail environment',1
UNION ALL
SELECT 'Business Intelligence', 4, 240, '2013-06-01', '2013-08-01','Provided business intelligence data for helpdesk at Ericsson',1

INSERT INTO publication
(title,authors,[date],[description],[publication],[profile])
SELECT 'Some article', 'J. Kåhrström, A. Tegen, A. Åström','2014-01-10','','A scientific article about some stuff.',1

INSERT INTO [skill]
([name],[level],[description],[profile])
SELECT '.NET-programming', 1, 'Know the basics of .NET programming', 1
UNION ALL
SELECT 'Python', 2, 'Can create apps and rest APIs', 1
UNION ALL
SELECT 'Project management', 2, 'Did some project management throughout my education and work.',1


INSERT INTO [merit]
([name],[description],[date],[profile])
SELECT 'President of the F-Guild','Leading the Physics guild at LTH for a year during my studies.','2010-01-01', 1


INSERT INTO [tag]
([text],[category],[profile])
SELECT 'Project manager','profiletag', 1
UNION ALL
SELECT 'Senior consultant', 'profiletag', 1