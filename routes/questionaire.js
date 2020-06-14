let express = require('express');
let router = express.Router();
let mmodel = require('../models/questionaireModel.js');
let encrypt = require('../models/encrypt.js');  //base64加密核心库

//编辑问卷
router.get("/index", function(req, res, next) {
	//if (!req.session.token) {
	//	res.send("<script>alert('登录态过期，请重新登录!');window.location.href='/';</script>").end();
	//	return;
	//}
	//else {
		mmodel.showquestionaire(req, res, (err, result) => {
			if (err) {
				console.log(err);
				res.send("<script>alert('加载失败!');</script>").end();
			} else {
				res.render("./questionaire", {
					questionaire: result[0],
					details: result[1],
					length: result.length == null ? 0 : result.length,
				});
			}
		});
    //}
});

module.exports = router;
