CREATE DATABASE IF NOT EXISTS `dev_DB` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `dev_DB`;

CREATE TABLE IF NOT EXISTS `testUsers` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `testUsers` (`id`, `email`, `password`) VALUES (1, 'test@test.com', '$2a$10$5GEG2RtotdrFHooO9XZe.ew0etF5jczJbei9pAuPnt7s5TT.DDaca');

ALTER TABLE `testUsers` ADD PRIMARY KEY (`id`);
ALTER TABLE `testUsers` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;

SELECT * FROM testUsers;