var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test');
var linebotRouter = require('./routes/linebot');
var apiRouter = require('./routes/api');

var DB = require('./models/mongoDB');

var cors = require('cors');
var session = require('express-session')

var app = express();




// 必須要在伺服器解析請求之前使用，因為line的中間層會去解析"原始版本資料"
app.use('/linebot', linebotRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(cors({
  origin: 'http://localhost', // 允許的前端 URL
  credentials: true // 允許跨域請求攜帶憑據（cookies）
}));


app.use(session({
  secret: 'mySecret',
  resave: true,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    maxAge: 20 * 60 * 1000 
  }
}));




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', testRouter);
app.use('/api',apiRouter);


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


DB.read('accounts').then(res=>{
  console.log(res);
})

module.exports = app;
