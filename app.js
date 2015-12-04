var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//flash中间件用于显示提示信息
var flash=require('connect-flash');
var passport = require('passport');
//mongoose中间件用于连接mongodb数据库
var mongoose = require('mongoose');
//引入mongoStore保存到数据库
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')(expressSession);
//multer中间件用于上传文件
var multer  = require('multer');

var app = express();
//设置模板
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//设置端口
var port = process.env.PORT || 3000;
app.set('port', port);
// app.use(multer({
//   dest: './src/imgs',
//   rename: function (fieldname, filename) {
//     return filename;
//   }
// }));
//链接到数据库
var dbUrl = 'mongodb://fyc:123@ds053894.mongolab.com:53894/testmongodb';
mongoose.connect(dbUrl);
//本地资源路径
app.use(express.static('build'));
//解析表单元素
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
//解析cookie
app.use(cookieParser());
//flash 是一个在 session 中用于存储信息的特定区域。信息写入 flash ，下一次显示完毕后即被清除。
app.use(flash());
app.use(expressSession({
  secret: 'SECRET',
  cookie: {
    maxAge: 60 * 60*1000*24 //一小时有效期
  },
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));
app.use(passport.initialize());
app.use(passport.session());
//路由地址
require('./routes/index')(app);
require('./routes/user')(app);
// 处理404错误
app.use(function(req, res,next) {
  var err = new Error('Not Found');
  err.status = 404;
   res.render('common/404', {
      message: err.message,
      error: err
    });
  next();
});
// //开发环境下打印错误信息
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('common/error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
// else{
//     //生产环境下不打印错误信息
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('common/error', {
//       message: err.message,
//       error: {}
//     });
//   });
// }

app.listen(port);
console.log('started on port ' + port);
module.exports = app;