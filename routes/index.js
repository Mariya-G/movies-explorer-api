const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login, singOut } = require('../controllers/users');
const { validateAuth, validatePersonalData } = require('../middlewares/validators');
const NotFound = require('../errors/not_found'); // 404

router.post('/signup', validatePersonalData, createUser);
router.post('/signin', validateAuth, login);
router.get('/signout', singOut);
router.use('/', auth, usersRouter);
router.use('/', auth, moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
