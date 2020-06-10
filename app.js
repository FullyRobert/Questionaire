let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session'); 
let encrypt = require('./models/encrypt.js');
//let paymentProcessRouter = require('./routes/paymentProcess');  
let accountRouter = require('./routes/account'); //账户管理路由
let manageRouter = require('./routes/manage'); //问卷管理路由
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串    
	cookie: { maxAge: 20 * 60 * 1000 }, //cookie生存周期20*60秒    
	resave: true,  //cookie之间的请求规则,假设每次登陆，就算会话存在也重新保存一次    
	saveUninitialized: true //强制保存未初始化的会话到存储器    
}));  //这些是写在app.js里面的    
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', accountRouter); //空路由默认转移到账户管理路由上
app.use('/account', accountRouter);   //账户管理路由
app.use('/manage', manageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//====================可在ejs模板中使用的函数====================
Date.prototype.format = function(fmt) { 
  var o = { 
      "M+" : this.getMonth()+1,                 //月份 
      "d+" : this.getDate(),                    //日 
      "h+" : this.getHours(),                   //小时 
      "m+" : this.getMinutes(),                 //分 
      "s+" : this.getSeconds(),                 //秒 
      "q+" : Math.floor((this.getMonth()+3)/3), //季度 
      "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) {
          fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  }
  for(var k in o) {
      if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
  }
  return fmt; 
}

app.locals.dateFormat = function(dateStr) {
  let date = new Date(dateStr);
  return date.format('yyyy-MM-dd hh:mm:ss');
}

app.locals.compileStr = encrypt.base64encode;

//============================================================

module.exports = app;
