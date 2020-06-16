let express = require('express');
let router = express.Router();
let smodel = require('../models/statisticsModel.js');
let encrypt = require('../models/encrypt.js');  //base64加密核心库



router.get('/index', (req, res) => {
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
		smodel.select_questionaire(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
			} else {
				res.render('./statistics/list', {
					details: result,
					length: result.length == null ? 0 : result.length,
				});
			}
		});		
	}
});

router.get("/result", function(req, res, next) {
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	else {
		smodel.showresult(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
			} else {
				smodel.getdata(req, result[0],result[1], (err, resu) => {
					if (err) {
						console.log(err);
						res.send("<script>alert('加载失败!');</script>").end();
					}
					else{
						res.render("./statistics/showresult", {
							id: req.query.questionaireid,
							title: result[0][0].title,
							description : result[0][0].description,
							details: result[1],
							datas: resu[1],
							length: resu[0] == null ? 0 :resu[0],
						});
					}
				});

			}
		});
    }
});

router.get("/getpiedata", function(req, res) {
	if (!req.session.token) {
		res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
		return;
	}
	smodel.getpiedata(req, res, (err, result) => {
		if (err) {
			console.log(err);
			//res.send("<script>alert('加载失败!');</script>").end();
		} else {
			res.send(result).end();
		}
	});
	
});


module.exports = router;
