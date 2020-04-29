var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* router is also known as a mini-app
With routers you can modularize your code more easily. You can use routers as:
1. Basic Routes: Home, About
2. Route Middleware to log requests to the console
3. Route with Parameters
4. Route Middleware for Parameters to validate specific parameters
5. Validates a parameter passed to a certain route
*/
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var storeRouter = require("./routes/storeRouter");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/*
Middleware functions:
Something you would do before passing the request to handlers.
https://expressjs.com/en/guide/writing-middleware.html
*/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use() is intended for binding middleware to your application.
// The path is a "mount" or "prefix" path and limits the middleware
// to only apply to any paths requested that begin with it. Like:
// app.all(/^\/.*/, function (req, res) { res.send('Hello');
 // });
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/stores", storeRouter);

app.get('/', function(req,res){
  res.send("Hello World");
});

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

module.exports = app;

