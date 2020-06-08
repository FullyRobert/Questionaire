/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : opm

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2019-06-06 10:36:01
*/
USE account;
SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `aftersale_record`
-- ----------------------------
DROP TABLE IF EXISTS `aftersale_record`;
CREATE TABLE `aftersale_record` (
  `order_id` varchar(20) NOT NULL,
  `complain` varchar(500) NOT NULL,
  `submit_time` datetime NOT NULL,
  `response` varchar(500) DEFAULT NULL,
  `reponder_id` int(11) DEFAULT NULL,
  `reply_time` datetime DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `reponder_id` (`reponder_id`),
  CONSTRAINT `aftersale_record_ibfk_1` FOREIGN KEY (`reponder_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `aftersale_record_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `order_form` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of aftersale_record
-- ----------------------------

-- ----------------------------
-- Table structure for `deal_record`
-- ----------------------------
DROP TABLE IF EXISTS `deal_record`;
CREATE TABLE `deal_record` (
  `deal_id` varchar(20) NOT NULL,
  `order_id` varchar(20) DEFAULT NULL,
  `from_id` int(11) NOT NULL,
  `to_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `information` varchar(200) DEFAULT NULL,
  `created_time` datetime NOT NULL,
  `transaction_status` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`deal_id`),
  KEY `from_id` (`from_id`),
  KEY `to_id` (`to_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `deal_record_ibfk_1` FOREIGN KEY (`from_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `deal_record_ibfk_2` FOREIGN KEY (`to_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `deal_record_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `order_form` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of deal_record
-- ----------------------------

-- ----------------------------
-- Table structure for `flight_com`
-- ----------------------------
DROP TABLE IF EXISTS `flight_com`;
CREATE TABLE `flight_com` (
  `flightName` varchar(40) DEFAULT NULL COMMENT '航班名',
  `userID` varchar(20) DEFAULT NULL COMMENT '用户名',
  `flightEvaluete` varchar(255) DEFAULT NULL COMMENT '航班评价',
  KEY `flightName` (`flightName`),
  CONSTRAINT `flight_com_ibfk_1` FOREIGN KEY (`flightName`) REFERENCES `flight_info` (`flightName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of flight_com
-- ----------------------------

-- ----------------------------
-- Table structure for `flight_info`
-- ----------------------------
DROP TABLE IF EXISTS `flight_info`;
CREATE TABLE `flight_info` (
  `flightName` varchar(40) NOT NULL COMMENT '航班名',
  `flightClass` varchar(40) DEFAULT NULL COMMENT '航班类型',
  `flightCompany` varchar(40) DEFAULT NULL COMMENT '航空公司',
  `landingPlace` varchar(40) DEFAULT NULL COMMENT '登机地点',
  `depaturePlace` varchar(40) DEFAULT NULL COMMENT '落地点',
  `landingTime` datetime DEFAULT NULL COMMENT '起飞时间',
  `departureTime` datetime DEFAULT NULL COMMENT '落地时间',
  `flightPrice` decimal(7,2) DEFAULT NULL COMMENT '航班价格',
  `specialTicket` tinyint(1) DEFAULT NULL COMMENT '是否特价票',
  `ticketAllowance` int(11) DEFAULT NULL COMMENT '票余量',
  PRIMARY KEY (`flightName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of flight_info
-- ----------------------------

-- ----------------------------
-- Table structure for `hotel_com`
-- ----------------------------
DROP TABLE IF EXISTS `hotel_com`;
CREATE TABLE `hotel_com` (
  `hotelName` varchar(40) DEFAULT NULL COMMENT '酒店名',
  `userID` varchar(20) DEFAULT NULL COMMENT '用户名',
  `hotelEvaluete` varchar(255) DEFAULT NULL COMMENT '酒店评价',
  KEY `hotelName` (`hotelName`),
  CONSTRAINT `hotel_com_ibfk_1` FOREIGN KEY (`hotelName`) REFERENCES `hotel_info` (`hotelName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of hotel_com
-- ----------------------------

-- ----------------------------
-- Table structure for `hotel_info`
-- ----------------------------
DROP TABLE IF EXISTS `hotel_info`;
CREATE TABLE `hotel_info` (
  `hotelName` varchar(40) NOT NULL COMMENT '酒店名',
  `hotelLocation` varchar(40) DEFAULT NULL COMMENT '酒店位置',
  `hotelScore` int(11) DEFAULT NULL COMMENT '酒店评分',
  `hotelStar` int(11) DEFAULT NULL COMMENT '酒店星级',
  `hotelPrice` decimal(7,2) DEFAULT NULL COMMENT '酒店价格',
  `checkIn` datetime DEFAULT NULL COMMENT '入住时间',
  `checkOut` datetime DEFAULT NULL COMMENT '退房时间',
  `specialRoom` tinyint(1) DEFAULT NULL COMMENT '是否特价房',
  `roomAllowance` int(11) DEFAULT NULL COMMENT '房间余量',
  PRIMARY KEY (`hotelName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of hotel_info
-- ----------------------------

-- ----------------------------
-- Table structure for `order_form`
-- ----------------------------
DROP TABLE IF EXISTS `order_form`;
CREATE TABLE `order_form` (
  `order_id` varchar(20) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `goods_name` varchar(20) NOT NULL,
  `price` int(11) NOT NULL,
  `receive_adr` varchar(200) NOT NULL,
  `current_status` int(1) NOT NULL,
  `created_time` datetime NOT NULL,
  `refund_time` datetime DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `seller_id` (`seller_id`),
  KEY `buyer_id` (`buyer_id`),
  CONSTRAINT `order_form_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_form_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of order_form
-- ----------------------------

-- ----------------------------
-- Table structure for `sys_statistics`
-- ----------------------------
DROP TABLE IF EXISTS `sys_statistics`;
CREATE TABLE `sys_statistics` (
  `total_user` int(11) DEFAULT NULL COMMENT '总用户',
  `daily_trading_volume` int(11) DEFAULT NULL COMMENT '日交易量',
  `active_user` int(11) DEFAULT NULL COMMENT '活跃用户',
  `constraint_admin` int(11) DEFAULT NULL COMMENT '受约束的管理员',
  `week_regist` int(11) DEFAULT NULL COMMENT '一周注册量',
  `cash_to_cash_ratio` int(11) DEFAULT NULL COMMENT '体现比',
  `feedback_number` int(11) DEFAULT NULL COMMENT '反馈数'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='系统后台统计信息表';

-- ----------------------------
-- Records of sys_statistics
-- ----------------------------

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(11) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '用户名',
  `password` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '密码',
  `realName` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '姓名',
  `licenseNumber` varchar(18) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '证件号',
  `dateOfBirth` char(12) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '出生日期',
  `phoneNumber` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '手机号',
  `emailAddr` varchar(64) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '邮箱',
  `typeOfUser` int(11) DEFAULT NULL COMMENT '用户类型',
  `balance` decimal(19,2) DEFAULT NULL COMMENT '余额',
  `payPassword` varchar(32) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '支付密码',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
