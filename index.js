var express = require('express'),
    app = express.createServer(),
    util = require('util'),
    fs = require('fs'),
    io = require('socket.io').listen(app), // Socket.io receiving and processing messages
    jade = require('jade');

/* Makes static files like js and css usable */
app.use('/public', express.static(__dirname + '/public'));

/* Sets jade template as engine and /views as template folder */
//TODO Not yet implemented
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

/* Main Page */
app.get('/', function(req,res) {
  console.log("GET / is accessed.");
  res.sendfile(__dirname + '/views/index.html');
});

/* Random Room */
app.get('/random', function(req,res) {
  console.log("GET /random is accessed");
  random_room = Math.floor(Math.random() * (10000)) + 1;
  res.redirect('/room/' + random_room);
});

/* Room */
var id = null;
app.get('/room/:id', function(req,res) {
  id = req.params.id;

  var rs = fs.createReadStream(__dirname + '/views/room.html');
  util.pump(rs,res);
  console.log("GET /room/" + id + " is accessed.");
});

/* Heroku configuration */
io.configure(function() {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function(socket) {
  var username;

  if (!id) {
    return;
  }
  socket.send('> Welcome to the Chat Room #' + id + '!');
  socket.send('> Input username: ');

  socket.on('message', function(message) {
    if (!username){
      username = message;
      socket.send('> Welcome, ' + username + '!');
      return;
    }
    socket.join('room' + id);
    feedback = "> " + username + " sent: " + message;
    io.sockets.in('room' + id).emit('message', feedback);
    console.log(username + " wrote: " + message);
  });

  /* On connection disconnect */
  //TODO Not yet implemented
  socket.on('disconnect', function() {
    socket.leave('room' + id);
    io.sockets.emit('> User disconnected.');
    console.log('User disconnected.');
  });
});


/* Error page */
app.get('*', function(req,res) {
  console.log("Error Page is accessed.");
  res.sendfile(__dirname + '/views/error.html');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on port " + port);
});
