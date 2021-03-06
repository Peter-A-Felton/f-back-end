var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// for db
var db = require('./db');



var bookRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// To be able to use the API everywhere... there are better ways to handle this!
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Expose-Headers", "Content-Length, X-JSON");
  response.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
  response.header("Access-Control-Allow-Headers", "*");
  response.header("Access-Control-Max-Age", "86400");
  next();
});

app.use('/', bookRouter);

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
