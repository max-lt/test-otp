const router = require('express').Router();
const speakeasy = require('speakeasy');

/**
 * Route : /api/totp/register (POST)
 */
router.get('/register', function (req, res) {
  const user = req.user;

  if (!user)
    return res.status(403).json({error: 'Unauthorized'});

  const secret = speakeasy.generateSecret({length: 32, name: 'test app'});
  console.log('totp: genreated secret', secret.base32); // secret of length 20

  user.totp.secret = secret;

  res.json(secret);
});

/**
 * Route : /api/totp/validate (POST)
 */
router.post('/validate', function (req, res) {
  const user = req.user;

  if (!user)
    return res.status(403).json({error: 'Unauthorized'});

  const token = req.body.token;

  if (!token)
    return res.status(400).json({error: 'Missing token'});

  if (!user.totp.secret)
    return res.status(400).json({error: 'Must register first'});

  const verified = speakeasy.totp.verify({
    secret: user.totp.secret.base32,
    encoding: 'base32',
    token: token
  });

  if (!verified)
    return res.status(403).json({error: 'bad token'});

  res.json({success: true});
});

module.exports = router;
