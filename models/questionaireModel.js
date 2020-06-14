const pool = require('./conn_pool');
const encrypt = require('../models/encrypt.js');
const { end } = require('./conn_pool');
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

module.exports = exported;