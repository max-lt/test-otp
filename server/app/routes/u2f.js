const router = require('express').Router();
const u2f = require('u2f');

const APP_ID = "https://127.0.0.1";

/**
 * Route : /api/u2f/register (GET)
 */
router.get('/register', function (req, res) {
  const user = req.user;

  if (!user)
    return res.status(403).json({error: 'Unauthorized'});

  const authRequest = u2f.request(APP_ID);
  /*
   authRequest : {
   version: 'U2F_V2',
   appId: 'https://127.0.0.1',
   challenge: 'suO1L...nBx1eLU'
   }
   */
  user.u2f.keyRegistrationRequest = authRequest;
  console.log('u2f: register (get)', authRequest);
  res.json(authRequest);
});

/**
 * Route : /api/u2f/register (POST)
 */
router.post('/register', function (req, res) {
  const user = req.user;

  if (!user)
    return res.status(403).json({error: 'Unauthorized'});

  console.log('u2f: register (post) body', req.body);

  /*
   {
   registrationData: 'Us3uV7uVq6d...pY28gVTJo',
   version: 'U2F_V2',
   appId: 'https://127.0.0.1',
   challenge: 'LmNpZ...F9wdWU',
   requestId: '101...dd',
   clientData: 'eyjAu...QifQ'
   }
   */

  const requestId = req.body.requestId;

  const checkRes = u2f.checkRegistration(user.u2f.keyRegistrationRequest, req.body);
  console.log('u2f: register (post) check', checkRes);
  /*
   {
   successful: true,
   publicKey: 'BPI...fs',
   keyHandle: '7g1umFt...ZVFYOg',
   certificate: <Buffer 13 23 59 75 62 69 63 ... >
   }
   */

  if (checkRes.successful) {
    //Users[req.cookies.userid] = { publicKey: checkRes.publicKey, keyHandle: checkRes.keyHandle };
    user.u2f.auth = checkRes;
    res.json({registered: true});
  } else {
    res.json({error: checkRes.errorMessage});
  }

});

/**
 * Route : /api/u2f/authenticate (GET)
 */
router.get('/authenticate', function (req, res) {
  const user = req.user;

  if (!user)
    return res.status(403).json({error: 'Unauthorized'});

  if (!user.u2f.auth || !user.u2f.auth.keyHandle)
    return res.status(400).json({error: 'Must register first'});

  const authRequest = u2f.request(APP_ID, user.u2f.auth.keyHandle);
  //Sessions[req.cookies.userid] = {authRequest: authRequest};
  user.u2f.keyAuthenticationRequest = authRequest;
  console.log('u2f: authenticate (get)', authRequest);
  res.json(authRequest);
});

/**
 * Route : /api/u2f/authenticate (POST)
 */
router.post('/authenticate', function (req, res) {
  const user = req.user;

  if (!user)
    return res.status(403).json({error: 'Unauthorized'});

  console.log('u2f: authenticate (post) body', req.body);
  const checkRes = u2f.checkSignature(
    user.u2f.keyAuthenticationRequest,
    req.body,
    user.u2f.auth.publicKey
  );

  console.log('u2f: authenticate (post) check', checkRes);
  if (checkRes.successful) {
    res.json({success: true});
  } else {
    res.json({error: checkRes.errorMessage});
  }
});

module.exports = router;
