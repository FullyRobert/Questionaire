let express = require('express');
let router = express.Router();
let qmodel = require('../models/questionaireModel.js');
let encrypt = require('../models/encrypt.js');  //base64加密核心库

//编辑问卷
router.get("/index", function(req, res, next) {
	//if (!req.session.token) {
	//	res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
	//	return;
	//}
	//else {
		qmodel.showquestionaire(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
			} else {
				let id = result[0][0].id;
				req.session.questionaireid = id;
				res.render("./questionaire", {
					questionaire: result[0],
					details: result[1],
					length: result.length == null ? 0 : result.length,
				});
			}
		});
    //}
});

router.post("/submit", function(req, res) {
	//if (!req.session.token) {
	//	res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
	//	return;
	//}
	qmodel.submit(req, function(err, ret) {
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

module.exports = router;
