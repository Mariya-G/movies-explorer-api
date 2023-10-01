const jwt = require('jsonwebtoken');

const ErrorAuth = require('../errors/err_auth');

const { SECRET_KEY, NODE_ENV } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_KEY : 'dev-secret');
  } catch (error) {
    return next(new ErrorAuth('Передан неверный логин или пароль'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
