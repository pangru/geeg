create database geeg;

CREATE TABLE `geeg`.`customer` (
  `c_id` INT NOT NULL AUTO_INCREMENT,
  `c_email` VARCHAR(45) NOT NULL,
  `c_name` VARCHAR(45) NULL,
  `c_phone` VARCHAR(45) NULL,
  `c_addr` VARCHAR(45) NULL,
  PRIMARY KEY (`c_id`, `c_email`),
  UNIQUE INDEX `c_id_UNIQUE` (`c_id` ASC));

