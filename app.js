var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
const secret = require('./utils/helpers');

var app = express();

app.locals.pluralize = require('pluralize');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const verifyToken = (req, res, next) => {
  if (req.path === '/login' || req.path === '/register') {
    return next();
  }

  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    jwt
      .verify(bearerToken, secret, (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: 'Token inválido ou expirado!' });
        }
        req.decoded = decoded;
        next();
      });
  } else {
    res
      .status(403)
      .json({ error: 'Token não informado!' });
  }
};

app.use(verifyToken);
app.use('/', indexRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
