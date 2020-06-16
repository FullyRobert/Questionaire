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

exported.showresult = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let param = [];
		let questionaireid = req.query.questionaireid;  //获取问卷id
		//先查询问卷的问题
		let sql = "select * from question where questionaire_id = ? order by id";
		param = [questionaireid];
		let ret = await conn.query(sql, param); 
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
		//然后查问卷信息
		sql = "select * from questionaire where id = ? order by id";
		ret = await conn.query(sql, questionaireid);
		let result = [ret[0],resu]; 
		callback(undefined, result);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//获取除了选择题以外的信息
exported.getdata = async (req, ress, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let param = [];
		let questionaireid = req.query.questionaireid;  //获取问卷id
		//获取用户填写记录
		let sql = "select * from data_record where questionaire_id =?";
		let user = await conn.query(sql, questionaireid);
		let length = user[0].length;
		let data =[];
		for (var i =0;i<res.length;i++){
			if (parseInt(res[i].type)>=3 && parseInt(res[i].type)<=6){
				//获取答案
				sql = "select * from data_question where question_id = ?";
				let answer = await conn.query(sql, res[i].id);
				//如果是文本问题，返回用户名和答案组成的数组
				if (res[i].type=="3" || res[i].type=="4"){
					username = getname(answer[0][0].record_id,user[0]);
					let text = gettext(username,answer[0]);
					data.push(text);
				}
				//如果是数字问题，返回由平均数、中位数、总和组成的数组
				else{
					let value = getvalue(answer[0]).sort();
					let sum = Sum(value);
					let avg = sum/value.length;
					let mid = Mid(value);
					data.push([sum,avg,mid]);
				}
			}
			else{
				data.push([]);
			}
			
		}
		callback(undefined, [length,data]);
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}

//获取画饼图所需要的信息
exported.getpiedata = async (req, res, callback) => {
	const conn = await pool.getConnection();
	try {
		let qid = req.query.qid;
		let type = req.query.type;
		let sql = "";
		let ret = [];
		let param = [];
		//获取是非题数据
		if (type == "0")
		{
			sql = "select * from data_question where question_id = ? and answer= 1";
			let yes = await conn.query(sql, qid); 
			sql = "select * from data_question where question_id = ? and answer= 0";
			let no = await conn.query(sql, qid);
			ret = [{ label: "是", data: yes[0].length },{ label: "否", data: no[0].length }]
			callback(undefined,ret);
		}
		//获取单选题数据
		else if (type == "1"){
			for (var i =1; i<=4; i++){
				sql = "select * from data_question where question_id = ? and answer= ?";
				param = [qid,i];
				let r = await conn.query(sql, param);
				ret.push({ label: "选项"+i, data: r[0].length });
			}
			callback(undefined,ret);
		}
		//处理多选题数据
		else if (type == "2"){
			sql = "select * from data_question where question_id = ?";
			param = [qid];
			let r = await conn.query(sql, param);
			let result = [0,0,0,0,0];
			let answer = r[0];
			for (var i =0; i<answer.length; i++){
				let str = answer[i].answer;
				for (var j =0; j<str.length; j++){
					result[parseInt(str[j])]+=1;
				}
			}
			for (var k =1; k<=4; k++){
				ret.push({ label: "选项"+k, data: result[k] });
			}
			callback(undefined,ret);
		}
		//处理评分题数据
		else if (type == "7"){
			//先查询一共有多少项
			let qsql = "select description from question where id = ?";
			let q = await conn.query(qsql, qid);
			let number = parseInt(q[0][0].description);
			for (var i =1; i<=number; i++){
				sql = "select * from data_question where question_id = ? and answer= ?";
				param = [qid,i];
				let r = await conn.query(sql, param);
				ret.push({ label: i+"分", data: r[0].length });
			}
			callback(undefined,ret);
		}		
	} catch (err) {
		console.log(err);
		callback(err, undefined);
	} finally {
		if (conn) conn.release();
	}
}
//一些处理函数
getvalue = function(answer){
	let ret = [];
	for (var i =0;i< answer.length;i++){
		ret.push(parseFloat(answer[i].answer));
	}
	return ret;
}

Sum = function(arr){
	let ret = 0;
	for (var i =0;i< arr.length;i++){
		ret = ret + arr[i];
	}
	return ret;
}

Mid = function(arr){
	if (arr.length%2==0)
		return (arr[arr.length/2]+arr[arr.length/2-1])/2;
	else
		return arr[parseInt(arr.length/2)];
}

getname = function(id,user){
	for (var i =0; i<user.length; i++)
		if (user[i].id == id)
			return user[i].username;
}

gettext = function(username,answer){
	let arr = [];
	for (var i =0; i<answer.length; i++){
		arr.push([username,answer[i].answer]);
	}
	return arr;
}

module.exports = exported;