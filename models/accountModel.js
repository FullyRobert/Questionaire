const pool = require("./conn_pool");
const utils = require("./utils");

module.exports = {
  /*
   * @功能: 用户登录操作验证
   * @返回值: 若验证通过返回该用户数据,否则返回空
   * @作者: 赵威凯
   */
  check_login: async function (req, callback) {
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

  regis: async function (req, callback) {
    try {
      const conn = await pool.getConnection();
      let username = req.body.username;
      let password = req.body.password;
      let dateOfBirth = req.body.dateOfBirth;
      let phoneNumber = req.body.phoneNumber;
      let emailAddr = req.body.emailAddr;

      if (
        username == null ||
        password === undefined ||
        dateOfBirth === undefined ||
        phoneNumber === undefined ||
        emailAddr === undefined
      ) {
        callback(undefined, -1);
      } else {
        let sqlinsert =
          "insert into user (username, password, dateOfBirth, phoneNumber, emailAddr) values(?,?,?,?,?)";
        let param = [username,password,dateOfBirth,phoneNumber,emailAddr];
        let ret = await conn.query(sqlinsert,param);
        callback(undefined, ret[0].id);
      }
      conn.release();
    } catch (err) {
      callback(err, undefined);
    }
  },

  getinfo: async function (req, callback) {
    try {
      const conn = await pool.getConnection();
      let id = req.session.token.uid;
      console.log(id);
      let sql = "select * from user where id = '" + id + "'";
      ret = await conn.query(sql);
      callback(undefined, ret[0]);
      conn.release();
    } catch (err) {
      callback(err, undefined);
    }
  },

  updateinfo: async function (req, callback) {
    try {
      const conn = await pool.getConnection();
      let dateOfBirth = req.body.dateOfBirth;
      let phoneNumber = req.body.phoneNumber;
      let emailAddr = req.body.emailAddr;

      if (
        dateOfBirth === undefined ||
        phoneNumber === undefined ||
        emailAddr === undefined
      ) {
        callback(undefined, -1);
        return;
      } else {
        let sqlupdate ="update user set dateOfBirth = ?, phoneNumber =?, emailAddr =? where id =?";
        let param = [dateOfBirth,phoneNumber,emailAddr,req.session.token.uid];
        ret = await conn.query(sqlupdate,param);
        callback(undefined, ret[0].id);
      }
      conn.release();
    } catch (err) {
      callback(err, undefined);
    }
  },

  changePasswd: async function (req, callback) {
    try {
      const conn = await pool.getConnection();
      let firstPasswd = req.body.firstPasswd;
      let secondPasswd = req.body.secondPasswd;
      if (firstPasswd != secondPasswd) {
        console.log("firstPasswd is not equal to secondPasswd");
        let status = 2;
        callback(undefined, status);
      } else {
        if (!req.session.token) {
          username = tempUsername;
        } else {
          username = req.session.token.username;
        }
        let sql = "update user set password = ? where username = ?";
        let param = [firstPasswd, username];
        let ret = await conn.query(sql, param);
        //console.log(req.session.token);
        let status = 1;
        callback(undefined, status);
      }
      conn.release();
    } catch (err) {
      callback(err, undefined)
    }
  },

  valiAuthencode: async function (req, callback) {
    try {
      let username = req.body.username;
      let emailAddress = req.body.emailAddress;
      let authenCode = req.body.authenCode;
      if (username == "" || emailAddress == "") {
        let status = 2;
        callback(undefined, status);
      } else if (authenCode != "123456") {
        let status = 3;
        callback(undefined, status);
      } else {
        tempUsername = username;
        let status = 1;
        callback(undefined, status);
      }
    } catch (err) {
      callback(err, undefined);
    }
  },
};