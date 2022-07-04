CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_fname` varchar(255) NOT NULL,
  `user_lname` varchar(255) NOT NULL,
  `user_phone_number` varchar(10) DEFAULT NULL,
  `user_status` char(1) DEFAULT NULL,
  `last_known_location` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `location_id_idx` (`last_known_location`),
  CONSTRAINT `last_known_location` FOREIGN KEY (`last_known_location`) REFERENCES `location` (`location_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;


CREATE TABLE `location` (
  `location_id` INT NOT NULL,
  `entity_id` INT NOT NULL,
  `entity_type` CHAR(1) NOT NULL,
  `lattitude` DECIMAL NOT NULL,
  `longitude` DECIMAL NOT NULL,
  PRIMARY KEY (`location_id`));


CREATE TABLE `hotzones` (
  `hotzone_id` int(11) NOT NULL AUTO_INCREMENT,
  `severity_rating` float DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `location` int(11) DEFAULT NULL,
  PRIMARY KEY (`hotzone_id`),
  KEY `location_id_idx` (`location`),
  CONSTRAINT `fk_location_id` FOREIGN KEY (`location`) REFERENCES `location` (`location_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `requests` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `fromUserID` int(11) DEFAULT NULL,
  `toUserID` int(11) DEFAULT NULL,
  `status` char(1) DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `fromUserID_idx` (`fromUserID`),
  KEY `toUserID_idx` (`toUserID`),
  CONSTRAINT `fromUserID` FOREIGN KEY (`fromUserID`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `toUserID` FOREIGN KEY (`toUserID`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `heroku_d7a7ceb951aadcd`.`incident` (
  `incident_id` INT NOT NULL AUTO_INCREMENT,
  `incident_location` INT NULL,
  `time` DATETIME NULL,
  `severity` FLOAT NULL,
  `report_details` VARCHAR(255) NULL,
  PRIMARY KEY (`incident_id`),
  INDEX `incident_location_idx` (`incident_location` ASC),
  CONSTRAINT `incident_location`
    FOREIGN KEY (`incident_location`)
    REFERENCES `heroku_d7a7ceb951aadcd`.`location` (`location_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
