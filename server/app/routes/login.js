const crypto = require('crypto');
const router = require('express').Router();

const users = require('../store').user;

const sha1 = (str) => crypto.createHash('sha1').update(str).digest('hex');

router.get('/', (req, res) => {
  res.json({user: req.user, path: req.path});
});

router.post('/login', (req, res) => {
  console.log('post /login', req.body);
  const {login, password} = req.body;

  if (!login)
    return res.status(400).json({error: 'Expected login'});

  const userId = sha1(login); // deterministic userId

  const user = users.get(userId);

  if (!user)
    return res.status(403).json({error: 'Unauthorized'});

  res.cookie('test-otp', userId, {maxAge: 900000, httpOnly: true});

  res.json({user, path: req.path});
});

router.all('/logout', (req, res) => res.clearCookie('test-otp').send(''));

/**
 * Route : /api/user/register (POST)
 */
router.post('/register', function (req, res, next) {
  const {login, password} = req.body;

  if (!login)
    return res.status(400).json({error: 'Expected login'});

  const userId = sha1(login); // deterministic userId

  if (users.has(userId))
    return res.status(401).json({error: 'User already registered'});

  const user = {login, password, totp: {}, u2f: {}};

  users.set(userId, user);

  res.cookie('test-otp', userId, {maxAge: 900000, httpOnly: true});

  res.json({user, path: req.path});
});

/**
 * Route : /* (ALL but GET)
 */
router.all('*', function (req, res, next) {
  console.log('all / route', req.originalUrl, req.path);
  res.json({user: req.user, path: req.path});
});

module.exports = router;
module.exports.authenticate = (req, res, next) => {
  const userId = req.cookies && req.cookies['test-otp'];

  req.user = users.get(userId);

  next()
};
