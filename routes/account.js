let express = require("express");
let router = express.Router();
var amodel = require("../models/accountModel.js");

router.get("/", function(req, res, next) {
    if (!req.session.token) {
        res.redirect("/account/login");
    } else {
        res.redirect("/account/account");
    }
});

router.get("/resetpwd", function(req, res) {
  res.render("account/resetpwd");
});

router.post("/resetpwd", function(req, res) {
  amodel.valiAuthencode(req, function(err, status) {
    if (err) {
      console.log(err);
      res.send({ status: 4 }).end();
    } else {
      if (status == 1) {
        res.send({ status: 1 }).end();
      } else if (status == 2) {
        res.send({ status: 2 }).end();
      } else if (status == 3) {
        res.send({ status: 3 }).end();
      }
    }
  });
});

router.get("/resetpwd2", function(req, res) {
  res.render("account/resetpwd2");
});

router.post("/resetpwd2", function(req, res) {
  amodel.changePasswd(req, function(err, status) {
    if (err) {
      console.log(err);
      res.send({ status: 3 }).end();
    } else {
      if (status == 2) {
        res.send({ status: 2 }).end();
      } else if (status == 1) {
        res.send({ status: 1 }).end();
      }
    }
  });
});


router.get("/account", function(req, res) {
  //登陆校验
  if (!req.session.token) {
    res.redirect("/account/login");
    //res.send("<script>alert('登录态过期，请重新登录！');</script>").end();
    return;
  }
  amodel.getinfo(req, function(err, ret) {
    if (err) {
      console.log(err);
      res.send({ status: -1 }).end(); //服务器异常
    } else {
      res.render("account/account", {
        username: ret[0].username,
        dateOfBirth: ret[0].dateOfBirth,
        phoneNumber: ret[0].phoneNumber,
        emailAddr: ret[0].emailAddr,
      });
    }
  });
});

router.post("/exit", function(req, res) {
  try {
    req.session.destroy();
    res.send({ status: 1 }).end(); //退出登陆成功
  } catch (err) {
    res.send({ status: 0 }).end(); //退出登陆失败
  }
});

router.post("/login", function(req, res) {
  amodel.check_login(req, function(err, ret) {
    if (err) {
      console.log(err);
      res.send({ status: -1 }).end(); //服务器异常
    } else {
      console.log(ret);
      var token = {
        username: null,
        uid: null,
      };
      if (ret.length > 0) {
        token.username = ret[0].username;
        token.uid = ret[0].id;
        req.session.token = token;
        console.log(req.session.token);
        res.send({ status: 1 }).end(); //验证成功
      } else {
        res.send({ status: 0 }).end(); //验证失败
      }
    }
  });
});

router.post("/register", function(req, res) {
  amodel.regis(req, function(err, ret) {
    if (err) {
      console.log(err);
      res.send({ status: -1 }).end(); //服务器异常
    } else {
      console.log(ret);
      if (ret < 0) {
        res.send({ status: 0 }).end(); //缺少信息
      } else {
        res.send({ status: 1 }).end(); //成功
      }
    }
  });
});


router.post("/updateinfo", function(req, res) {
  amodel.updateinfo(req, function(err, ret) {
    if (err) {
      console.log(err);
      res.send({ status: -1 }).end(); //服务器异常
    } else {
      console.log(ret);
      if (ret < 0) {
        res.send({ status: 0 }).end(); //缺少信息
      } else {
        res.send({ status: 1 }).end(); //成功
      }
    }
  });
});

router.get("/index", (req, res) => {
  if (!req.session.token) {
    res.redirect("/account/login");
    //res.send("<script>alert('登录态过期，请重新登录！');</script>").end();
    return;
  } else res.render("account/index");
});


router.get("/change_passwd", (req, res) => {
  if (!req.session.token) {
    res.redirect("/account/login");
    //res.send("<script>alert('登录态过期，请重新登录！');</script>").end();
    return;
  } else res.render("account/resetpwd2");
});

router.get("/error", (req, res) => {
  res.render("error");
});


router.get("/refund", (req, res) => {
  res.render("account/refund");
});

router.get("/login", (req, res) => {
  res.render("account/login");
});

router.get("/manage", (req, res) => {
  res.redirect("../manage");
});

router.get("/register", (req, res) => {
  res.render("account/register");
});

module.exports = router;
