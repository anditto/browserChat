var express = require('express'),
    app = express.createServer(),
    util = require('util'),
    fs = require('fs'),
    io = require('socket.io').listen(app), // Socket.io receiving and processing messages
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

/* Room */
app.get('/room/:id', function(req,res) {
  var roomId = req.params.id;
  console.log("GET /room/" + roomId + " is accessed.");
});

/* Heroku configuration */
io.configure(function() {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function(socket) {
  var username;

  socket.send('> Welcome to the Chat Server!');
  socket.send('> Input username: ');

  socket.on('message', function(message) {
    if (!username){
      username = message;
      socket.send('> Welcome, ' + username + '!');
      return;
    }
    feedback = "> " + username + " sent: " + message;
    io.sockets.emit('message', feedback);
    console.log(username + " wrote: " + message);
  });

  /* Not yet implemented */
  socket.on('disconnect', function() {
    io.sockets.emit('> User disconnected.');
    console.log('User disconnected.');
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on port " + port);
});
