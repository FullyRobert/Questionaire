const pool = require('./conn_pool');
const encrypt = require('../models/encrypt.js');
const systime = require('silly-datetime');
let exported = {};


exported.showquestionaire = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let questionaireid = req.query.id;  //获取问卷id
		//获取问卷信息
		let sqlselect = "select * from questionaire where id = ?"///
		let questionaire = await conn.query(sqlselect, [questionaireid]); 
		//获取问卷问题内容
		let sql = "select * from question where questionaire_id = ? order by id";
		let ret = await conn.query(sql,questionaireid); 
		let resu = ret[0];
		for (var i =0;i<resu.length;i++){
			//如果当前节点是子节点
			if (resu[i].ischild == 1){
				//寻找父节点
				for (var j =0; j<resu.length; j++){
					//找到父节点，塞入父节点后
					if (resu[i].parentid == resu[j].id){
						let child = resu[i];
						resu.splice(i,1);
						resu.splice(j+1,0,child);
					}
				}
			}
		}
		let result = [questionaire[0],resu];
		callback(undefined, result);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//将问卷数据录入数据库
exported.submit = async function (req, callback) {
	const conn = await pool.getConnection();
    try {
		let sqlinsert = "";
		let param = [];
		let id= req.query.id;
		let data = req.body;
		let keys = Object.keys(data);
		let values = Object.values(data);
		//将填写用户、填写时间写入数据库
		let time=systime.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
		sqlinsert ="insert into data_record (user_id,username,questionaire_id,end_time) values(?,?,?,?)";
		if (!req.session.token) 
			param = ["-1","游客",id,time];
		else
			param = [req.session.token.uid,req.session.token.username,id,time];
		let ret = await conn.query(sqlinsert,param);
		//将问题答案写入数据库
		for (var i =0; i<keys.length;i++){
			if (values[i]!=""){
				sqlinsert =
				"insert into data_question (questionaire_id, question_id, answer,record_id) values(?,?,?,?)";
				if (Object.prototype.toString.call(values[i])=='[object Array]'){
					let answer = values[i].join('');
					param = [id,keys[i],answer,ret[0].insertId];
				}
				else
					param = [id,keys[i],values[i],ret[0].insertId];
				await conn.query(sqlinsert,param);
			}
		}
		//更新填写量
		let sqlupdate = "update questionaire set cur_num=cur_num+1 where id = ?";
		await conn.query(sqlupdate,id);
		callback(undefined, 1);
		conn.release();
	}
	catch (err) {
		callback(err, undefined);
    }
},

//检查登录
exported.check_login = async function (req, callback) {
    try {
		const conn = await pool.getConnection();
      	let sql = "select * from user where username = ? and password = ?";
		let param = [req.body.username, req.body.password];
		let ret = await conn.query(sql, param);
		callback(undefined, ret[0]);
		conn.release();
    } catch (err) {
		callback(err, undefined);
    }
},

module.exports = exported;