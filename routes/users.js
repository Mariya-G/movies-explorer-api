const router = require('express').Router();
const { validateUpdateProfile } = require('../middlewares/validators');
const { getUser, updateUser } = require('../controllers/users');

router.get('/users/me', getUser);
router.patch('/users/me', validateUpdateProfile, updateUser);

module.exports = router;
