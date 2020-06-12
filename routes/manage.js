let express = require('express');
let router = express.Router();
let mmodel = require('../models/manageModel.js');
let encrypt = require('../models/encrypt.js');  //base64加密核心库



router.get('/showlist', (req, res) => {
	//for developer to test
	//req.session.token = token;
	//--------------------------
	//code for check session will be put here
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	//---------------------------
	else{ 
		mmodel.select_questionaire(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
			} else {
				req.session.details = result;
				res.render('./manage/showlist', {
					username: req.session.token.username,
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 2) ? req.query.selector : 3
				});
			}
		});		
	}
});

//创建新问卷
router.post("/create", function(req, res) {
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	
	mmodel.create(req, function(err, ret) {
	if (err) {
		console.log(err);
		res.send({ status: -1 }).end(); //服务器异常
	} else {
		console.log(ret);
		if (ret < 0) {
		  res.send({ status: 0 }).end(); //缺少信息
		} else {
		  res.send({ status: 1 }).end(); //成功
		}
	}
	});
});

//删除问卷
router.post('/delete', (req, res) => {
	//for developer to test
	//req.session.token = token;
	//--------------------------
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	mmodel.delete(req, res, (err, ret) => {
		if (err) {
			res.send("<script>alert('问卷删除失败!'); self.location = document.referrer;</script>").end();
		} else {
			res.send("<script>alert('问卷删除成功!'); self.location = document.referrer;</script>");
		}
	});
});

//编辑问卷
router.get("/editquestionaire", function(req, res, next) {
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	else {
		mmodel.editquestionaire(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
			} else {
				req.session.question = result;
				res.render("./manage/editquestionaire", {
					id: req.query.questionaireid,
					title: req.session.details[req.query.pos].title,
					description : req.session.details[req.query.pos].description,
					details: result,
					length: result.length == null ? 0 : result.length,
				});
			}
		});
    }
});

module.exports = router;
