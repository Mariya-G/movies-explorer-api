const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const NotFound = require('../errors/not_found'); // 404
const Conflict = require('../errors/conflict'); // 409
const BadRequest = require('../errors/bad-request'); // 400

const { SECRET_KEY, NODE_ENV } = process.env;

const OK = 200;
const CREATED = 201;

const SALT_ROUNDS = 10;

const login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? SECRET_KEY : 'dev-secret', { expiresIn: '7d' });
      return res.status(OK).cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: 'none', secure: true,
      }).send({
        email: user.email,
        _id: user._id,
        name: user.name,
      });
    })
    .catch(next);
};

const singOut = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
  res.end();
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => Users.create({
      name, email, password: hash,
    }))
    .then((data) => res.status(CREATED).send({
      name: data.name, email: data.email,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные пользователя'));
      } else if (error.code === 11000) {
        next(new Conflict('Такой пользователь уже существует!'));
      } else {
        next(error);
      }
    });
};

const getUser = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userID = req.user._id;
  Users.findByIdAndUpdate(userID, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        next(new NotFound('Пользователь по указанному _id не найден.'));
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else if (error.code === 11000) {
        next(new Conflict('Такой пользователь уже существует!'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getUser,
  login,
  createUser,
  singOut,
  updateUser,
};
