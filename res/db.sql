/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : questionaire

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2020-06-06 10:36:01
*/
create Database questionaire;
USE questionaire;
SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(11) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '用户名',
  `password` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '密码',
  `dateOfBirth` char(12) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '出生日期',
  `phoneNumber` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '手机号',
  `emailAddr` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '邮箱',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------

-- ----------------------------
-- Table structure for `questionaire`
-- ----------------------------
DROP TABLE IF EXISTS `questionaire`;
CREATE TABLE `questionaire` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(64) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '0',
  `maxnum` int(11) NOT NULL DEFAULT '100',
  `cur_num` int(11) NOT NULL DEFAULT '0',
  `end_time` datetime,
  `authority` int(1) NOT NULL DEFAULT '0',
  `url` varchar(255),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `questionaire_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of questionaire
-- ----------------------------

insert into questionaire (user_id, title, status) values(1,'test',0);
insert into questionaire (user_id, title, status) values(1,'test2',1);
insert into questionaire (user_id, title, status) values(1,'test3',2);