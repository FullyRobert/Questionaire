let express = require('express');
let router = express.Router();
let qmodel = require('../models/questionaireModel.js');
let encrypt = require('../models/encrypt.js');  //base64加密核心库
const systime = require('silly-datetime');

//编辑问卷
router.get("/index", function (req, res, next) {
	qmodel.showquestionaire(req, res, (err, result) => {
		if (err) {
			console.log(err);
			res.send("<script>alert('加载失败!');</script>").end();
		} else {
			//判断是否在收集时间内、问卷状态是否正确
			let time = systime.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
			if (Date.parse(time) > Date.parse(result[0][0].end_time) || parseInt(result[0][0].status) != 1)
				res.send("<script>alert('问卷已经停止收集!');</script>").end();
			//判断填写量是否大于要求的填写量
			else if (parseInt(result[0][0].cur_num) >= parseInt(result[0][0].maxnum)) {
				if (parseInt(result[0][0].authority) == 1 || parseInt(result[0][0].authority) == 2) {
					res.send("<script>alert('问卷已经达到最大填写量，欢迎下次参与!');</script>").end();
				}
				else if (parseInt(result[0][0].authority) == 3) {
					res.send("<script>alert('问卷已经达到今日填写量上限，请明天再来!');</script>").end();
				}
			}
			else {
				//判断问卷是否需要登录
				let login = 0;
				if (parseInt(result[0][0].authority) == 1 && !req.session.token) {
					login = 1;
				}
				res.render("./questionaire", {
					login: login,
					questionaire: result[0],
					details: result[1],
					length: result.length == null ? 0 : result.length,
				});
			}
		}
	});
});

router.post("/submit", function (req, res) {
	qmodel.submit(req, function (err, ret) {
		if (err) {
			console.log(err);
			res.send({ status: -1 }).end(); //服务器异常
		} else {
			if (ret < 0) {
				res.send({ status: 0 }).end(); //缺少信息
			} else {
				res.send({ status: 1 }).end(); //成功
			}
		}
	});
});

router.post("/login", function (req, res) {
	qmodel.check_login(req, function (err, ret) {
		if (err) {
			console.log(err);
			res.send({ status: -1 }).end(); //服务器异常
		} else {
			console.log(ret);
			var token = {
				username: null,
				uid: null,
			};
			if (ret.length > 0) {
				token.username = ret[0].username;
				token.uid = ret[0].id;
				req.session.token = token;
				res.send({ status: 1 }).end(); //验证成功
			} else {
				res.send({ status: 0 }).end(); //验证失败
			}
		}
	});
});

module.exports = router;
