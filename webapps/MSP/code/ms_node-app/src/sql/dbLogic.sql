CREATE OR REPLACE VIEW `view_user` AS
SELECT 
    u.Id AS UserId,
    u.Role as Role,
    p.Id AS ProfileId,
    u.Ref,
    p.FirstName,
    p.LastName,
    p.Pronouns,
    p.Headline,
    p.CompanyHeadline,
    p.Picture,
    p.City,
    p.State,
    p.YearsExperience,
    p.LookingFor,
    p.IndustryExperience,
    u.Status
FROM
    User u
        INNER JOIN
    Profile p ON (p.UserId = u.Id)
WHERE u.Status = "active";

DROP procedure IF EXISTS `sp_getUserConnections`;

CREATE PROCEDURE `sp_getUserConnections` (IN pUserId int(11), pUserRef varchar(36), pConnected varchar(12))
BEGIN
    SELECT DISTINCT
        u.UserId,
        u.ProfileId,
        u.Role,
        u.Ref,
        u.FirstName,
        u.LastName,
        u.Pronouns,
        u.Headline,
        u.CompanyHeadline,
        u.Picture,
        u.LookingFor,
        CASE
            WHEN c.UserId IS NOT NULL THEN 'connected'
            WHEN q.UserRef IS NULL THEN 'notConnected'
            WHEN q.UserRef IS NOT NULL THEN 'pending'
        END AS Connected,
        NULL IsOnline
    FROM
        view_user u
            LEFT JOIN
        (SELECT 
            mb.UserId
        FROM
            Member mb
        LEFT JOIN Member m ON (m.ChannelId = mb.ChannelId)
        WHERE
            m.Status = 'active'
                AND m.UserId = pUserId
                AND mb.UserId <> pUserId
        GROUP BY mb.ChannelId
        HAVING COUNT(mb.ChannelId) = 1) c ON (u.UserId = c.UserId)
            LEFT JOIN
        (SELECT 
            mr.UserRef
        FROM
            Member m
        INNER JOIN Channel cha ON m.ChannelId = cha.Id
        INNER JOIN MemberRequest mr ON mr.ChannelRef = cha.Ref
            AND mr.Status = 'pending'
        WHERE
            m.UserId = pUserId
                AND m.Status = 'active'
        GROUP BY ChannelId
        HAVING COUNT(ChannelId) = 1 UNION ALL SELECT 
            mr.CreatedBy
        FROM
            MemberRequest mr
        WHERE
            mr.UserRef = pUserRef
                AND mr.Status = 'pending') q ON q.UserRef = u.Ref
    WHERE
        u.UserId <> pUserId
            AND ((CASE
            WHEN c.UserId IS NOT NULL THEN 'connected'
            WHEN q.UserRef IS NULL THEN 'notConnected'
            WHEN q.UserRef IS NOT NULL THEN 'pending'
        END) = pConnected
            OR pConnected IS NULL);
END;

DROP procedure IF EXISTS `sp_getUserSearch`;

CREATE PROCEDURE `sp_getUserSearch`(
IN pUserId INT(11),
IN pUserRef varchar(36),
IN pKeyword VARCHAR(255), 
IN pArrCity VARCHAR(255), 
IN pArrState VARCHAR(255),
IN pArrYearsExp VARCHAR(255),
IN pArrSchool VARCHAR(255),
IN pArrCompany VARCHAR(255),
IN pArrIndustry VARCHAR(255),
IN pArrIntent VARCHAR(255)
)
BEGIN
DECLARE sqlWhere VARCHAR(8000);
DECLARE done INT DEFAULT FALSE;
DECLARE industry_experience VARCHAR(100);
DECLARE cur CURSOR FOR SELECT val FROM filter_params;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

	SET @sqlStatement = 'SELECT DISTINCT
        u.UserId,
        u.ProfileId,
        u.Role,
        u.Ref,
        u.FirstName,
        u.LastName,
        u.Pronouns,
        u.Headline,
        u.CompanyHeadline,
        u.Picture,
        u.LookingFor,
        CASE
            WHEN c.UserId IS NOT NULL THEN ''connected''
            WHEN q.UserRef IS NULL THEN ''notConnected''
            WHEN q.UserRef IS NOT NULL THEN ''pending''
        END AS Connected,
        NULL IsOnline
    FROM
        view_user u
            LEFT JOIN
        (SELECT 
            mb.UserId
        FROM
            Member mb
        LEFT JOIN Member m ON (m.ChannelId = mb.ChannelId)
        WHERE
            m.Status = ''active''';
	SET @sqlStatement = CONCAT(@sqlStatement, ' AND m.UserId = ', pUserId);
	SET @sqlStatement = CONCAT(@sqlStatement, ' AND mb.UserId <> ', pUserId);
	SET @sqlStatement = CONCAT(@sqlStatement, ' GROUP BY mb.ChannelId
        HAVING COUNT(mb.ChannelId) = 1) c ON (u.UserId = c.UserId)
            LEFT JOIN
        (SELECT 
            mr.UserRef
        FROM
            Member m
        INNER JOIN Channel cha ON m.ChannelId = cha.Id
        INNER JOIN MemberRequest mr ON mr.ChannelRef = cha.Ref AND mr.Status = ''pending''
        WHERE');
	SET @sqlStatement = CONCAT(@sqlStatement, ' m.UserId = ', pUserId);
	SET @sqlStatement = CONCAT(@sqlStatement, ' AND m.Status = ''active''
        GROUP BY ChannelId
        HAVING COUNT(ChannelId) = 1 UNION ALL SELECT 
            mr.CreatedBy
        FROM
            MemberRequest mr
        WHERE');
	SET @sqlStatement = CONCAT(@sqlStatement, ' mr.UserRef = ''', pUserRef, '''');
	SET @sqlStatement = CONCAT(@sqlStatement, ' AND mr.Status = ''pending'') q ON q.UserRef = u.Ref
    LEFT JOIN EducationHistory eh ON eh.ProfileId = u.ProfileId
	WHERE ');
    
    SET sqlWhere = CONCAT('u.UserId <> ', pUserId, '', CHAR(13));

    IF pKeyword IS NOT NULL THEN
		SET sqlWhere = CONCAT(sqlWhere, " AND (",
        "u.FirstName like '%",pKeyword,
        "%' OR u.LastName like '%",pKeyword,
        "%' OR u.HeadLine like '%",pKeyword,
        "%' OR u.CompanyHeadline like '%",pKeyword,
        "%' OR u.LookingFor like '%",pKeyword,
        "%')",CHAR(13));
    END IF;
    
    IF pArrCity IS NOT NULL THEN
		SET sqlWhere = CONCAT(sqlWhere,' and u.City in (', pArrCity, ')', CHAR(13));
    END IF;
    
    IF pArrState IS NOT NULL THEN
		SET sqlWhere = CONCAT(sqlWhere,' and u.State in (', pArrState, ')', CHAR(13));
    END IF;
    
    IF pArrYearsExp IS NOT NULL THEN
		SET sqlWhere = CONCAT(sqlWhere,' and u.YearsExperience in (', pArrYearsExp, ')', CHAR(13));
    END IF;
    
    IF pArrSchool IS NOT NULL THEN
		SET sqlWhere = CONCAT(sqlWhere,' and eh.School in (', pArrSchool, ')', CHAR(13));
    END IF;
    
    IF pArrCompany IS NOT NULL THEN
		SET sqlWhere = CONCAT(sqlWhere,' and u.CompanyHeadline in (', pArrCompany, ')', CHAR(13));
    END IF;
  
    IF pArrIndustry IS NOT NULL THEN
		SET sqlWhere = CONCAT(sqlWhere,' and (');
        DROP TEMPORARY TABLE IF EXISTS filter_params;
		CREATE TEMPORARY TABLE filter_params( val CHAR(255) );
		SET @sql_temp_table = CONCAT("insert into filter_params (val) values ('", REPLACE(( SELECT GROUP_CONCAT(DISTINCT REPLACE(pArrIndustry,'\'','"')) AS data), ",", "'),('"),"');");
		PREPARE stmt1 FROM @sql_temp_table;
		EXECUTE stmt1;
        
        set @cond = '';

        OPEN cur;

		READ_LOOP: LOOP
		FETCH cur INTO industry_experience;
		IF done THEN
			LEAVE READ_LOOP;
		END IF;
		
		SET @cond = CONCAT(' or JSON_CONTAINS(JSON_EXTRACT(u.IndustryExperience,\'$.tags[*].text\'), \'',industry_experience,'\',\'$\') = 1', @cond);

		END LOOP;
		CLOSE cur;
        
        SET @cond = CONCAT(SUBSTR(@cond, 4, LENGTH(@cond)),')');
        SET sqlWhere = CONCAT(sqlWhere, @cond, CHAR(13));
        
    END IF;
        
    IF pArrIntent IS NOT NULL THEN
		SET sqlWhere = CONCAT(sqlWhere,' and u.LookingFor in (', pArrIntent, ')', CHAR(13));
    END IF;
    
	SET @sqlStatement = CONCAT(@sqlStatement,sqlWhere);
    
    PREPARE st from @sqlStatement;
    EXECUTE st;
    DEALLOCATE PREPARE st;
END;


DROP procedure IF EXISTS `sp_updateScheduleEvents`;

CREATE PROCEDURE `sp_updateScheduleEvents` (IN pEventId int(11), pScheduleId int(11), pMeetRef char(36), pTwilioRef char(36), pStatus varchar(45))
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN 
		ROLLBACK;
        SELECT 0 as executed;
	END;
	START TRANSACTION;
		UPDATE Event 
		SET 
			Status = pStatus,
			ModifiedBy = CreatedBy,
			ModifiedOn = now()
		WHERE
			Id = pEventId;
		UPDATE Schedule 
		SET 
			Status = pStatus,
			ModifiedBy = CreatedBy,
			ModifiedOn = now()
		WHERE
			Id = pScheduleId;
		UPDATE Meet 
		SET 
			Status = pStatus,
			TwilioRef = pTwilioRef,
			ModifiedBy = CreatedBy,
			ModifiedOn = now()
		WHERE
			Ref = pMeetRef;
            
		SELECT 1 as executed;
    COMMIT;
END;

SET @MsRef = uuid();
INSERT INTO GroupMember
(`Id`,
`Ref`,
`CompanyRef`,
`Status`,
`Role`,
`Name`,
`IsDefault`,
`CreatedBy`,
`CreatedOn`,
`ModifiedBy`,
`ModifiedOn`)
SELECT * FROM (SELECT 0 as Id,
@MsRef as Ref,
null as CompanyRef,
"active" as Status,
'{"roles": ["MS Administrator", "MS Community Administrator"]}' as Role,
"MSP" as Name,
1 as IsDefault,
@MsRef as CreatedBy,
now() as CreatedOn,
null as ModifiedBy,
null as ModifiedOn
) AS temp
WHERE NOT EXISTS (
    SELECT * FROM GroupMember
where CompanyRef IS NULL and IsDefault = 1
) LIMIT 1;
INSERT INTO ProgEventTrigger (`Id`,
`Ref`,
`Status`,
`Type`,
`Category`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id,
uuid() as Ref,
"active" as Status,
"1:1" as Type,
"meetSchedule" as Category,
now() as CreatedOn,
uuid() as CreatedBy,
null as ModifiedOn,
null as ModifiedBy) AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventTrigger WHERE Type = '1:1' AND Category = "meetSchedule"
) LIMIT 1;
INSERT INTO ProgEventTrigger (`Id`,
`Ref`,
`Status`,
`Type`,
`Category`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id,
uuid() as Ref,
"active" as Status,
"1:*" as Type,
"meetSchedule" as Category,
now() as CreatedOn,
uuid() as CreatedBy,
null as ModifiedOn,
null as ModifiedBy) AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventTrigger WHERE Type = '1:*' AND Category = "meetSchedule"
) LIMIT 1;
INSERT INTO ProgEventTrigger (`Id`,
`Ref`,
`Status`,
`Type`,
`Category`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id,
uuid() as Ref,
"active" as Status,
"1:MS" as Type,
"meetSchedule" as Category,
now() as CreatedOn,
uuid() as CreatedBy,
null as ModifiedOn,
null as ModifiedBy) AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventTrigger WHERE Type = '1:MS' AND Category = "meetSchedule"
) LIMIT 1;
INSERT INTO ProgEventTrigger (`Id`,
`Ref`,
`Status`,
`Type`,
`Category`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id,
uuid() as Ref,
"active" as Status,
"1:Comp" as Type,
"meetSchedule" as Category,
now() as CreatedOn,
uuid() as CreatedBy,
null as ModifiedOn,
null as ModifiedBy) AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventTrigger WHERE Type = '1:Comp' AND Category = "meetSchedule"
) LIMIT 1;
INSERT INTO ProgEventTrigger (`Id`,
`Ref`,
`Status`,
`Type`,
`Category`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id,
uuid() as Ref,
"active" as Status,
"Topic" as Type,
"meetSchedule" as Category,
now() as CreatedOn,
uuid() as CreatedBy,
null as ModifiedOn,
null as ModifiedBy) AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventTrigger WHERE Type = 'Topic' AND Category = "meetSchedule"
) LIMIT 1;
INSERT INTO ProgEventTrigger (`Id`,
`Ref`,
`Status`,
`Type`,
`Category`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id,
uuid() as Ref,
"active" as Status,
"Session" as Type,
"meetSchedule" as Category,
now() as CreatedOn,
uuid() as CreatedBy,
null as ModifiedOn,
null as ModifiedBy) AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventTrigger WHERE Type = 'Session' AND Category = "meetSchedule"
) LIMIT 1;
INSERT INTO ProgEventResponse (`Id`,
`Ref`,
`ProgEventTriggerId`,
`Response`,
`Message`,
`Specs`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id, 
       uuid() as Ref,
       Id as ProgEventTriggerId, 
       "action" as Response, 
       "Join your video call now" as Message, 
      '{"specs": "today"}' as Specs,
       now() as CreatedOn,
       uuid() as CreatedBy,
       null as ModifiedOn,
       null as ModifiedBy
from ProgEventTrigger WHERE Type = "1:1" and Category="meetSchedule") AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventResponse WHERE Response = "action" and ProgEventTriggerId = (SELECT Id from ProgEventTrigger WHERE Type = "1:1" and Category="meetSchedule")
) LIMIT 1;
INSERT INTO ProgEventResponse (`Id`,
`Ref`,
`ProgEventTriggerId`,
`Response`,
`Message`,
`Specs`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id, 
       uuid() as Ref,
       Id as ProgEventTriggerId, 
       "reminder" as Response, 
       "You have an upcoming video call" as Message, 
      '{"specs": "nextDay"}' as Specs,
       now() as CreatedOn,
       uuid() as CreatedBy,
       null as ModifiedOn,
       null as ModifiedBy
from ProgEventTrigger WHERE Type = "1:1" and Category="meetSchedule") AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventResponse WHERE Response = "reminder" and ProgEventTriggerId = (SELECT Id from ProgEventTrigger WHERE Type = "1:1" and Category="meetSchedule")
) LIMIT 1;
INSERT INTO ProgEventResponse (`Id`,
`Ref`,
`ProgEventTriggerId`,
`Response`,
`Message`,
`Specs`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id, 
       uuid() as Ref,
       Id as ProgEventTriggerId, 
       "action" as Response, 
       "Join your video call now" as Message, 
      '{"specs": "today"}' as Specs,
       now() as CreatedOn,
       uuid() as CreatedBy,
       null as ModifiedOn,
       null as ModifiedBy
from ProgEventTrigger WHERE Type = "1:*" and Category="meetSchedule") AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventResponse WHERE Response = "action" and ProgEventTriggerId = (SELECT Id from ProgEventTrigger WHERE Type = "1:*" and Category="meetSchedule")
) LIMIT 1;
INSERT INTO ProgEventResponse (`Id`,
`Ref`,
`ProgEventTriggerId`,
`Response`,
`Message`,
`Specs`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id, 
       uuid() as Ref,
       Id as ProgEventTriggerId, 
       "reminder" as Response, 
       "You have an upcoming video call" as Message, 
      '{"specs": "nextDay"}' as Specs,
       now() as CreatedOn,
       uuid() as CreatedBy,
       null as ModifiedOn,
       null as ModifiedBy
from ProgEventTrigger WHERE Type = "1:*" and Category="meetSchedule") AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventResponse WHERE Response = "reminder" and ProgEventTriggerId = (SELECT Id from ProgEventTrigger WHERE Type = "1:*" and Category="meetSchedule")
) LIMIT 1;
INSERT INTO ProgEventResponse (`Id`,
`Ref`,
`ProgEventTriggerId`,
`Response`,
`Message`,
`Specs`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id, 
       uuid() as Ref,
       Id as ProgEventTriggerId, 
       "action" as Response, 
       "Join your video call now" as Message, 
      '{"specs": "today"}' as Specs,
       now() as CreatedOn,
       uuid() as CreatedBy,
       null as ModifiedOn,
       null as ModifiedBy
from ProgEventTrigger WHERE Type = "1:MS" and Category="meetSchedule") AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventResponse WHERE Response = "action" and ProgEventTriggerId = (SELECT Id from ProgEventTrigger WHERE Type = "1:MS" and Category="meetSchedule")
) LIMIT 1;

INSERT INTO ProgEventResponse (`Id`,
`Ref`,
`ProgEventTriggerId`,
`Response`,
`Message`,
`Specs`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id, 
       uuid() as Ref,
       Id as ProgEventTriggerId, 
       "reminder" as Response, 
       "You have an upcoming video call" as Message, 
      '{"specs": "nextDay"}' as Specs,
       now() as CreatedOn,
       uuid() as CreatedBy,
       null as ModifiedOn,
       null as ModifiedBy
from ProgEventTrigger WHERE Type = "1:MS" and Category="meetSchedule") AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventResponse WHERE Response = "reminder" and ProgEventTriggerId = (SELECT Id from ProgEventTrigger WHERE Type = "1:MS" and Category="meetSchedule")
) LIMIT 1;


INSERT INTO ProgEventResponse (`Id`,
`Ref`,
`ProgEventTriggerId`,
`Response`,
`Message`,
`Specs`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id, 
       uuid() as Ref,
       Id as ProgEventTriggerId, 
       "action" as Response, 
       "Join your video call now" as Message, 
      '{"specs": "today"}' as Specs,
       now() as CreatedOn,
       uuid() as CreatedBy,
       null as ModifiedOn,
       null as ModifiedBy
from ProgEventTrigger WHERE Type = "1:Comp" and Category="meetSchedule") AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventResponse WHERE Response = "action" and ProgEventTriggerId = (SELECT Id from ProgEventTrigger WHERE Type = "1:Comp" and Category="meetSchedule")
) LIMIT 1;

INSERT INTO ProgEventResponse (`Id`,
`Ref`,
`ProgEventTriggerId`,
`Response`,
`Message`,
`Specs`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id, 
       uuid() as Ref,
       Id as ProgEventTriggerId, 
       "reminder" as Response, 
       "You have an upcoming video call" as Message, 
      '{"specs": "nextDay"}' as Specs,
       now() as CreatedOn,
       uuid() as CreatedBy,
       null as ModifiedOn,
       null as ModifiedBy
from ProgEventTrigger WHERE Type = "1:Comp" and Category="meetSchedule") AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventResponse WHERE Response = "reminder" and ProgEventTriggerId = (SELECT Id from ProgEventTrigger WHERE Type = "1:Comp" and Category="meetSchedule")
) LIMIT 1;


INSERT INTO ProgEventResponse (`Id`,
`Ref`,
`ProgEventTriggerId`,
`Response`,
`Message`,
`Specs`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id, 
       uuid() as Ref,
       Id as ProgEventTriggerId, 
       "action" as Response, 
       "Join your video call now" as Message, 
      '{"specs": "today"}' as Specs,
       now() as CreatedOn,
       uuid() as CreatedBy,
       null as ModifiedOn,
       null as ModifiedBy
from ProgEventTrigger WHERE Type = "Topic" and Category="meetSchedule") AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventResponse WHERE Response = "action" and ProgEventTriggerId = (SELECT Id from ProgEventTrigger WHERE Type = "Topic" and Category="meetSchedule")
) LIMIT 1;

INSERT INTO ProgEventResponse (`Id`,
`Ref`,
`ProgEventTriggerId`,
`Response`,
`Message`,
`Specs`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id, 
       uuid() as Ref,
       Id as ProgEventTriggerId, 
       "reminder" as Response, 
       "You have an upcoming video call" as Message, 
      '{"specs": "nextDay"}' as Specs,
       now() as CreatedOn,
       uuid() as CreatedBy,
       null as ModifiedOn,
       null as ModifiedBy
from ProgEventTrigger WHERE Type = "Topic" and Category="meetSchedule") AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventResponse WHERE Response = "reminder" and ProgEventTriggerId = (SELECT Id from ProgEventTrigger WHERE Type = "Topic" and Category="meetSchedule")
) LIMIT 1;
INSERT INTO ProgEventResponse (`Id`,
`Ref`,
`ProgEventTriggerId`,
`Response`,
`Message`,
`Specs`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id, 
       uuid() as Ref,
       Id as ProgEventTriggerId, 
       "action" as Response, 
       "Join your video call now" as Message, 
      '{"specs": "today"}' as Specs,
       now() as CreatedOn,
       uuid() as CreatedBy,
       null as ModifiedOn,
       null as ModifiedBy
from ProgEventTrigger WHERE Type = "Session" and Category="meetSchedule") AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventResponse WHERE Response = "action" and ProgEventTriggerId = (SELECT Id from ProgEventTrigger WHERE Type = "Session" and Category="meetSchedule")
) LIMIT 1;

INSERT INTO ProgEventResponse (`Id`,
`Ref`,
`ProgEventTriggerId`,
`Response`,
`Message`,
`Specs`,
`CreatedOn`,
`CreatedBy`,
`ModifiedOn`,
`ModifiedBy`)
SELECT * FROM (SELECT 0 as Id, 
       uuid() as Ref,
       Id as ProgEventTriggerId, 
       "reminder" as Response, 
       "You have an upcoming video call" as Message, 
      '{"specs": "nextDay"}' as Specs,
       now() as CreatedOn,
       uuid() as CreatedBy,
       null as ModifiedOn,
       null as ModifiedBy
from ProgEventTrigger WHERE Type = "Session" and Category="meetSchedule") AS temp
WHERE NOT EXISTS (
    SELECT Id FROM ProgEventResponse WHERE Response = "reminder" and ProgEventTriggerId = (SELECT Id from ProgEventTrigger WHERE Type = "Session" and Category="meetSchedule")
) LIMIT 1;

