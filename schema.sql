
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_fname` varchar(255) NOT NULL,
  `user_lname` varchar(255) NOT NULL,
  `user_phone_number` varchar(10) DEFAULT NULL,
  `user_status` char(1) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `location_id_idx` (`location_id`),
  CONSTRAINT `location_id` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `location` (
  `location_id` INT NOT NULL,
  `entity_id` INT NOT NULL,
  `entity_type` CHAR(1) NOT NULL,
  `lattitude` DECIMAL NOT NULL,
  `longitude` DECIMAL NOT NULL,
  PRIMARY KEY (`location_id`));

