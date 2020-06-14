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
  `description` varchar(255) NOT NULL,
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

insert into questionaire (user_id, title, description, status) values(1,'test','这是一个测试问卷',0);
insert into questionaire (user_id, title, description, status) values(1,'test2','这是一个测试问卷',1);
insert into questionaire (user_id, title, description, status) values(1,'test3','这是一个测试问卷',2);

-- ----------------------------
-- Table structure for `question`
-- ----------------------------
--type说明：1单选 2多选 3单行文本框 4多行文本框 5数字框 6小数框 7评分框 8（预留）地理位置框 9(预留)时间
DROP TABLE IF EXISTS `question`;
CREATE TABLE `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `questionaire_id` int(11) NOT NULL,
  `title` varchar(64) NOT NULL,
  `description` varchar(255),
  `type` int(1) NOT NULL DEFAULT '0',
  `isparent` tinyint(1) NOT NULL DEFAULT '0',
  `childyes` int(11) NOT NULL DEFAULT '0',
  `childno` int(11) NOT NULL DEFAULT '0',
  `ischild`  tinyint(1) NOT NULL DEFAULT '0',
  `parentid` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `questionaire_id` (`questionaire_id`),
  CONSTRAINT `question_ibfk_1` FOREIGN KEY (`questionaire_id`) REFERENCES `questionaire` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of question
-- ----------------------------

insert into question (questionaire_id, title, description, type) values(12,'下列课程哪一门是本学期的必修课程？','债券系统|外汇系统|软件工程|B/S软件体系设计',1);
insert into question (questionaire_id, title, description, type) values(12,'下列课程哪一门是本学期的选修课程？','债券系统|外汇系统|软件工程|B/S软件体系设计',2);
insert into question (questionaire_id, title, description, type) values(12,'请输入您的姓名','',3);
insert into question (questionaire_id, title, description, type) values(12,'请输入您对本课程的评价','',4);
insert into question (questionaire_id, title, description, type) values(12,'B/S软件体系的课程学时是？','',5);
insert into question (questionaire_id, title, description, type) values(12,'B/S软件体系的课程学分是？','0.1',6);
insert into question (questionaire_id, title, description, type) values(12,'请对本课程进行评分','5',7);

-- ----------------------------
-- Table structure for `data`
-- ----------------------------
DROP TABLE IF EXISTS `data_question`;
CREATE TABLE `data_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `questionaire_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `record_id` int(11) NOT NULL,
  `answer` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `data_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `data_record`;
CREATE TABLE `data_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `username` varchar(11) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '用户名',
  `questionaire_id` int(11) NOT NULL,
  `end_time` datetime,
  `ip` varchar(64) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `questionaire_id` (`questionaire_id`),
  CONSTRAINT `record_ibfk_1` FOREIGN KEY (`questionaire_id`) REFERENCES `questionaire` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;