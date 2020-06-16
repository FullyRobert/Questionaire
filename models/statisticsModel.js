const pool = require('./conn_pool');
const encrypt = require('../models/encrypt.js');
let exported = {};

//问卷属性查询
exported.select_questionaire = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let param = [];
		let user_id = req.session.token.uid;  //获取id
		let sql = "select * from questionaire where user_id = ? and status= 2";
		param = [user_id];
		let ret = await conn.query(sql, param); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

module.exports = exported;