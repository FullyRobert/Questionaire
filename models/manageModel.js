const pool = require('./conn_pool');
const encrypt = require('../models/encrypt.js');
let exported = {};

//问卷属性查询
exported.select_questionaire = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let param = [];
		let selector = req.query.selector; //GET方式获取参数
		let user_id = req.session.token.uid;  //获取id
		let sql = "select * from questionaire where user_id = ?";
		if (selector >= 0 && selector <= 2) {
			sql = sql + " and status = ? order by id desc; ";
			param = [user_id, selector];
		} else {
			sql = sql + " order by id desc;";
			param = [user_id];
		}
		let ret = await conn.query(sql, param); 
		callback(undefined, ret[0]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//创建问卷
exported.create = async function (req, callback) {
	const conn = await pool.getConnection();
    try {
		let user_id= req.session.token.uid;
		let title = req.body.title;
		let maxnum = req.body.maxnum;
		let description = req.body.description;
		if (user_id == null ||title === undefined ||maxnum === undefined) {
			callback(undefined, -1);
		} else {
        let sqlinsert =
			"insert into questionaire (user_id, title,description,maxnum) values(?,?,?,?)";
        let param = [user_id,title,description,maxnum];
        let ret = await conn.query(sqlinsert,param);
		callback(undefined, ret[0].id);
		}
		conn.release();
	}
	catch (err) {
		callback(err, undefined);
    }
},

//删除问卷
exported.delete = async(req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let id = req.session.details[req.body.pos].id;
		await conn.query("delete from questionaire where id = ?", [id]);
		callback(undefined, "delete_ok");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//编辑问卷
exported.editquestionaire = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let param = [];
		let questionaireid = req.query.questionaireid;  //获取问卷id
		let sql = "select * from question where questionaire_id = ? order by id";
		param = [questionaireid];
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