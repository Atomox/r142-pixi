var express = require('express');
var app = express();
var server = require('http').createServer(app);


app.use(express.static(__dirname + '/includes'));

app.get('/', function(req, resp, next) {
  console.log('Homepage time!');
  resp.sendFile(__dirname + '/html/index.html');
});

app.get('/track', function(req, resp, next) {
  console.log('Track time.');
  resp.sendFile(__dirname + '/html/track.html');
});

server.listen('8000');
