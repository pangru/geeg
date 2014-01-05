 CREATE TABLE `notice` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `body` blob NOT NULL,
  `create_date` datetime NOT NULL,
  `read_cnt` int(11) NOT NULL DEFAULT '0',
  `writer_email` varchar(45) NOT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

CREATE TABLE `event` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `edate` varchar(45) NOT NULL,
  `place` varchar(45) NOT NULL,
  `info` blob,
  `poster` varchar(45) DEFAULT NULL,
  `banner` varchar(45) DEFAULT NULL,
  `create_date` datetime NOT NULL,
  `read_cnt` int(11) NOT NULL DEFAULT '0',
  `writer_email` varchar(45) NOT NULL,
  PRIMARY KEY (`eid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

CREATE TABLE `user` (
  `email` varchar(45) NOT NULL,
  `password` varchar(45) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `is_login` tinyint(1) DEFAULT '0',
  `is_mng` tinyint(1) NOT NULL DEFAULT '0',
  `is_sns` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;