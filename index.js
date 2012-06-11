var express = require('express'),
    app = express.createServer(),
    util = require('util'),
    fs = require('fs'),
    io = require('socket.io'),
    jade = require('jade');

/* Makes static files like js and css usable */
app.use('/public', express.static(__dirname + '/public'));

/* Sets jade template as engine and /views as template folder */
// Not yet implemented
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

/* Main Page */
app.get('/', function(req,res) {
  console.log("GET / accessed.");
  //res.sendfile(__dirname + '/views/index.html');
  var rs = fs.createReadStream(__dirname + '/views/index.html');
  util.pump(rs,res);
});

/* Socket.io receiving and processing messages */
var socket = io.listen(app);

socket.on('connection', function(client) {
  var username;

  client.send('Welcome to the Chat Server!');
  client.send('Input username: ');

  client.on('message', function(message) {
    if (!username){
      username = message;
      client.send('Welcome, ' + username + '!');
      return;
    }
    feedback = "" + username + " sent: " + message;
    client.send(feedback);
    client.broadcast.send(feedback);
  });
});

app.listen(3000);
