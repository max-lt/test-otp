const path = require('path');
const express = require('express');
const router = express.Router();

const STATIC_DIR = path.join(__dirname, '../../../client');
const INDEX = path.join(STATIC_DIR, 'index.html');

const sendIndex = (req, res) => res.sendFile(INDEX);

router.get('/otp', sendIndex);
router.get('/u2f', sendIndex);
router.get('/totp', sendIndex);
router.use('/', express.static(STATIC_DIR));
router.use('/node_modules/', express.static(path.join(__dirname, '../../../node_modules')));

module.exports = router;
module.exports.login = require('./login');
module.exports.u2f = require('./u2f');
module.exports.totp = require('./totp');

// https://www.npmjs.com/package/speakeasy
// https://github.com/ashtuchkin/u2f
// https://demo.yubico.com/php-yubico/Modhex_Calculator.php
// https://demo.yubico.com/
// https://developers.yubico.com/U2F/Libraries/Using_a_library.html
// https://developers.yubico.com/libu2f-host/
// https://sedemo-mktb.rhcloud.com/
// https://github.com/herrjemand/U2F-Flask-Demo/blob/master/app/static/js/u2f-demo.js#L273
