const pool = require('./conn_pool');
const encrypt = require('../models/encrypt.js');
const { end } = require('./conn_pool');
const systime = require('silly-datetime');
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
		let publictype = req.body.publictype;
		let enddate = req.body.enddate;
		let description = req.body.description;
		if (user_id == null ||title === undefined ||maxnum === undefined || enddate === undefined || publictype === undefined) {
			callback(undefined, -1);
		} else {
        let sqlinsert =
			"insert into questionaire (user_id, title,description,maxnum,authority,end_time) values(?,?,?,?,?,?)";
        let param = [user_id,title,description,maxnum,publictype,enddate];
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

//新增问题
exported.newquestion = async function (req, callback) {
	const conn = await pool.getConnection();
    try {
		let id = req.session.questionaireid;
		let title = req.body.title;
		let type = req.body.questiontype;
		let sqlinsert = "";
		let param = [];
		//根据不同的问题类型写不同的sql语句
		if (type == "1" || type == "2"){
			sqlinsert = "insert into question (questionaire_id, title, description, type) values(?,?,?,?)";
			let description = req.body.a + "|" + req.body.b +  "|" + req.body.c + "|" + req.body.d;
			param = [id,title,description,type];
		}
		else if (type == "0" || type == "3" || type == "4" || type == "5"){
			sqlinsert = "insert into question (questionaire_id, title, type) values(?,?,?)";
			param = [id,title,type];
		}
		else if (type == "6"){
			sqlinsert = "insert into question (questionaire_id, title, description, type) values(?,?,?,?)";
			param = [id,title,req.body.accuracy,type];
		}
		else if (type == "7"){
			sqlinsert = "insert into question (questionaire_id, title, description, type) values(?,?,?,?)";
			param = [id,title,req.body.num,type];
		}
        let ret = await conn.query(sqlinsert,param);
		callback(undefined, ret[0].id);

		conn.release();
	}
	catch (err) {
		callback(err, undefined);
    }
},

//删除问题
exported.delquestion = async(req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let id = req.body.questionnum;
		let ret = await conn.query("delete from question where id = ?", [id]);
		callback(undefined, ret[0].a);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//发布问卷
exported.public = async(req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let id = req.session.details[req.body.pos].id;
		let url = "http://localhost:3030/questionaire?id="+id;
		await conn.query("UPDATE questionaire SET status = 1, url = ? where id = ?", [url,id]);
		callback(undefined, "public_ok");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//终止问卷
exported.stop = async(req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let id = req.session.details[req.body.pos].id;
		let time=systime.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
		await conn.query("UPDATE questionaire SET status = 2, end_time = ? where id = ?", [time,id]);
		callback(undefined, "stop_ok");
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

module.exports = exported;