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
DROP Database questionaire;
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
insert into user (username, password, dateOfBirth,phoneNumber, emailAddr) values('3170105163','123456','1998-12-16','18888926486','3170105163@zju.edu.cn');
insert into user (username, password, dateOfBirth,phoneNumber, emailAddr) values('满满','1234','1998-12-16','18888926486','3170105163@zju.edu.cn');
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
  `begin_time` datetime,
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

insert into questionaire (user_id, title, description, status,end_time,authority) values(1,'B/S体系软件设计','这是一个未发布的测试问卷,题目已经拟好',0,'2020-06-30 00:00:00',1);
insert into questionaire (user_id, title, description, status,begin_time,end_time,authority,url) values(1,'B/S体系软件设计测试问卷2','这是一个正在发布的测试问卷,题目已经拟好',1,'2020-06-08 00:00:00','2020-06-30 00:00:00',1,"http://localhost:3030/questionaire/index?id=2");
insert into questionaire (user_id, title, description, status, cur_num,begin_time,end_time,authority,url) values(1,'B/S体系软件设计测试问卷3','这是一个已结束的测试问卷,题目已经拟好',2,20,'2020-06-08 00:00:00','2020-06-15 00:00:00',1,"http://localhost:3030/questionaire/index?id=3");

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

insert into question (questionaire_id, title, description, type) values(1,'下列课程哪一门是本学期的必修课程？','债券系统|外汇系统|软件工程|B/S软件体系设计',1);
insert into question (questionaire_id, title, description, type) values(1,'下列课程哪一门是本学期的选修课程？','债券系统|外汇系统|软件工程|B/S软件体系设计',2);
insert into question (questionaire_id, title, description, type) values(1,'请输入您的姓名','',3);
insert into question (questionaire_id, title, description, type) values(1,'请输入您对本课程的评价','',4);
insert into question (questionaire_id, title, description, type) values(1,'B/S软件体系的课程学时是？','',5);
insert into question (questionaire_id, title, description, type) values(1,'B/S软件体系的课程学分是？','0.1',6);
insert into question (questionaire_id, title, description, type) values(1,'请对本课程进行评分','5',7);
insert into question (questionaire_id, title, description, type ,isparent,childyes,childno) values(1,'您认为本课程是否对您有帮助','',0,1,9,10);
insert into question (questionaire_id, title, description, type ,ischild,parentid) values(1,'请简述你在课程中学到了什么','',4,1,8);
insert into question (questionaire_id, title, description, type ,ischild,parentid) values(1,'请给出意见','',4,1,8);

insert into question (questionaire_id, title, description, type) values(2,'下列课程哪一门是本学期的必修课程？','债券系统|外汇系统|软件工程|B/S软件体系设计',1);
insert into question (questionaire_id, title, description, type) values(2,'下列课程哪一门是本学期的选修课程？','债券系统|外汇系统|软件工程|B/S软件体系设计',2);
insert into question (questionaire_id, title, description, type) values(2,'请输入您的姓名','',3);
insert into question (questionaire_id, title, description, type) values(2,'请输入您对本课程的评价','',4);
insert into question (questionaire_id, title, description, type) values(2,'B/S软件体系的课程学时是？','',5);
insert into question (questionaire_id, title, description, type) values(2,'B/S软件体系的课程学分是？','0.1',6);
insert into question (questionaire_id, title, description, type) values(2,'请对本课程进行评分','5',7);
insert into question (questionaire_id, title, description, type ,isparent,childyes,childno) values(2,'您认为本课程是否对您有帮助','',0,1,19,20);
insert into question (questionaire_id, title, description, type ,ischild,parentid) values(2,'请简述你在课程中学到了什么','',4,1,18);
insert into question (questionaire_id, title, description, type ,ischild,parentid) values(2,'请给出意见','',4,1,18);

insert into question (questionaire_id, title, description, type) values(3,'下列课程哪一门是本学期的必修课程？','债券系统|外汇系统|软件工程|B/S软件体系设计',1);
insert into question (questionaire_id, title, description, type) values(3,'下列课程哪一门是本学期的选修课程？','债券系统|外汇系统|软件工程|B/S软件体系设计',2);
insert into question (questionaire_id, title, description, type) values(3,'请输入您的姓名','',3);
insert into question (questionaire_id, title, description, type) values(3,'请输入您对本课程的评价','',4);
insert into question (questionaire_id, title, description, type) values(3,'B/S软件体系的课程学时是？','',5);
insert into question (questionaire_id, title, description, type) values(3,'B/S软件体系的课程学分是？','0.1',6);
insert into question (questionaire_id, title, description, type) values(3,'请对本课程进行评分','5',7);
insert into question (questionaire_id, title, description, type ,isparent,childyes,childno) values(3,'您认为本课程是否对您有帮助','',0,1,29,30);
insert into question (questionaire_id, title, description, type ,ischild,parentid) values(3,'请简述你在课程中学到了什么','',4,1,28);
insert into question (questionaire_id, title, description, type ,ischild,parentid) values(3,'请给出意见','',4,1,28);
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
  `begin_time` datetime,
  `end_time` datetime,
  `ip` varchar(64) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `questionaire_id` (`questionaire_id`),
  CONSTRAINT `record_ibfk_1` FOREIGN KEY (`questionaire_id`) REFERENCES `questionaire` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;