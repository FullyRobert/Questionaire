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
				req.session.details = result;
				res.render('./statistics/showlist', {
					username: req.session.token.username,
					details: result,
					length: result.length == null ? 0 : result.length,
					selector: (req.query.selector >= 0 && req.query.selector <= 2) ? req.query.selector : 3
				});
			}
		});		
	}
});


module.exports = router;
