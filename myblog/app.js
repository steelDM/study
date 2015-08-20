
//这些中间件只有在起服务的时候才会用到
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials')
var SS = require('./models/session');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

console.log(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//访问中间件

app.use(logger('dev'));
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//解析cookies，并挂载到req上，req.cookies
app.use(cookieParser('mengmeng'));
//简易session
app.use(SS);

//先去以静态文件解析，没有再以路由解析，还没有返回404

//指定根目录
app.use(express.static(path.join(__dirname, 'public')));

//绑定需要的controller
app.use('/', routes);
app.use('/users', users);


//通过代码顺序进行错误维护，这很不安全啊
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
