var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');

const app = require('./app');

var privateKey = fs.readFileSync(path.join(__dirname, '../cert/nginx.key'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, '../cert/nginx.crt'), 'utf8');

var credentials = {key: privateKey, cert: certificate};

const server = https.createServer(credentials, app);

http.createServer((req, res) => {
  res.writeHead(302, {'Location': 'https://127.0.0.1/' + req.url});
  res.end();
}).listen(80);

let listener = server.listen(443, () => {
  let port = listener.address().port;
  console.log('App listening on port ' + port);
});
