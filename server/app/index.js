const app = require('express')();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('express-async-errors');

const routes = require('./routes');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(routes.login.authenticate);

// Routes
app.use('/api/user', routes.login);
app.use('/api/u2f', routes.u2f);
app.use('/api/totp', routes.totp);

app.use('/', routes);

app.use((error, req, res, next) => {
  const code = 500;
  const message = 'Internal Server Error';
  res.status(code).json({error: {message, code}});
});

module.exports = app;
