let express = require('express');
let router = express.Router();
let pmodel = require('../models/paymentModel.js');
let utils = require('../models/utils.js'); //自定义工具库
let encrypt = require('../models/encrypt.js');  //base64加密核心库
let svgCaptcha = require('svg-captcha');  //动态验证码核心课
let app = express();
const ADMIN = 3;
const SELLER = 2;
const BUYER = 1;
// const token = {
// 	username: '嘤菜鸡',
// 	uid: '1',
// 	typeOfUser: 1
// }

router.get('/', (req, res) => {
	//for developer to test
	//req.session.token = token;
	//--------------------------
	//code for check session will be put here
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	//---------------------------
	if (req.session.token.typeOfUser == BUYER) {  //买家页面
		pmodel.select_orders(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./payment/transaction', {
					username: req.session.token.username,
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 5) ? req.query.selector : 6
				});
			}
		});		
	} else if (req.session.token.typeOfUser == SELLER) {  //卖家页面
		pmodel.select_seller_orders(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
				//res.send("<script>alert('加载失败！');window.location.href='/user/login'</script>").end();
			} else {
				req.session.details = result;
				res.render('./payment/transactionseller', {
					username: req.session.token.username,
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 5) ? req.query.selector : 6
				});
			}
		});	
	} else res.send("<script>alert('好像你的身份不能访问呢!');window.location.href='/account';</script>").end();
});

router.post('/confirmReceived', (req, res) => {
	//for developer to test
	//req.session.token = token;
	//--------------------------
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	pmodel.confirm_received(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('确认收货失败!'); self.location = document.referrer;</script>").end();
		} else {
			res.send("<script>alert('确认收货成功!'); self.location = document.referrer;</script>");
		}
	});
});

router.post('/cancelOrder', (req, res) => {
	//for developer to test
	//req.session.token = token;
	//--------------------------
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	pmodel.cancel_orders(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('订单取消失败!'); self.location = document.referrer;</script>").end();
		} else {
			res.send("<script>alert('订单取消成功!'); self.location = document.referrer;</script>");
		}
	});
});

router.post('/applyRefund', (req, res) => {
	//for developer to test
	//req.session.token = token;
	//--------------------------
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	req.body.pos = valid_check(req.body.pos);
	if (!req.body.pos) {
		res.send("<script>alert('年轻人你的思想很危险!');</script>").end();
		return;
	}
	pmodel.apply_refund(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('退款申请失败!'); self.location = document.referrer;</script>").end();
		} else {
			res.send("<script>alert('退款申请成功!'); self.location = document.referrer;</script>");
		}
	});
});

router.post('/cancelRefund', (req, res) => {
	//for developer to test
	//req.session.token = token;
	//--------------------------
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	pmodel.cancel_refund(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('退款取消失败!'); self.location = document.referrer;</script>").end();
		} else {
			res.send("<script>alert('退款取消成功!'); self.location = document.referrer;</script>");
		}
	});
});

router.post('/confirmRefund', (req, res) => {
	//for developer to test
	//req.session.token = token;
	//--------------------------
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}

	req.body.pos = valid_check(req.body.pos);
	if (!req.body.pos) {
		res.send({status:500}).end();
		return;
	}
	pmodel.confirm_refund(req, res, (err, ret) => {
		if (err) {
			res.send({status:500}).end();
		} else {
			res.send({status:200});
		}
	});
});

router.post('/confirmShipment', (req, res) => {
	//for developer to test
	//req.session.token = token;
	//--------------------------
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	pmodel.confirm_shipment(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('确认发货失败!'); self.location = document.referrer;</script>").end();
		} else {
			res.send("<script>alert('确认发货成功!'); self.location = document.referrer;</script>");
		}
	});
});

router.post('/complain', (req, res) => {
	//for developer to test
	//req.session.token = token;
	//--------------------------
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	req.body.pos = valid_check(req.body.pos);
	if (!req.body.pos) {
		res.send("<script>alert('年轻人你的思想很危险!');</script>").end();
		return;
	}
	pmodel.complain(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('投诉失败!'); self.location = document.referrer;</script>").end();
		} else {
			res.send("<script>alert('投诉成功!'); self.location = document.referrer;</script>");
		}
	});
});


router.get('/orderInfo', (req, res) => {
	//for developer to test
	//req.session.token = token;
	//--------------------------
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	let deCode = valid_check(req.query.oid);  //对订单号进行base64加密
	if (!deCode) {
		res.send("<script>alert('年轻人你的思想很危险!');</script>").end();
		return;
	} else req.query.oid = deCode;
	if (req.session.token.typeOfUser == BUYER) {
		pmodel.order_info(req, res, (err, ret) => {
			if (err) {
				res.send("<script>alert('年轻人你的思想很危险!');</script>").end();
			} else {
				res.render('./payment/transactioninfo', {
					username: req.session.token.username,
					details: ret[0] == null ? null : ret[0],
					session: req.query.session
				});
			}
		});		
	} else if (req.session.token.typeOfUser == SELLER) {
		pmodel.seller_order_info(req, res, (err, ret) => {
			if (err) {
				res.send("<script>alert('年轻人你的思想很危险!');</script>").end();
			} else {
				res.render('./payment/transactionsellerinfo', {
					username: req.session.token.username,
					details: ret[0] == null ? null : ret[0],
					session: req.query.session
				});
			}
		});
	} else res.send("<script>alert('年轻人你的思想很危险!');</script>").end();
});

router.get('/captcha', (req, res) => { 
	let captcha = svgCaptcha.create();
	req.session.captcha = captcha.text; //生成动态码存到session中并返回给前端
	console.log(req.session.captcha);
	res.type('svg');
	res.status(200).send(captcha.data);
});

router.post('/captcha', (req, res) => {
	if (!req.session.captcha || req.session.captcha != req.body.dynamic) {
		res.send({status:500}).end();  //错误验证码
	} else {
		pmodel.payfor_orders(req, res, (err, ret) => {
			if (err) {
				res.send({status:err}).end();
			} else {
				res.send({status:200, balance: ret});
			}
		});
	}
});


let valid_check = (str) => {
	if (!str) return null;
	let checkregex = /^\d+$/;
	let deCode = encrypt.base64decode(str).replace(/^YCJ20190608/,"");
	//console.log("DEBUG1:", deCode);
	if (isNaN(deCode) || !checkregex.test(deCode)) return null;
	return deCode;
}

module.exports = router;
