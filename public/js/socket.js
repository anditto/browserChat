$(document).ready(function() {
    var entry_el = $('#entry');
    var socket = new io.connect(window.location.hostname);
    var commands = ['/img','/trollFace']; // TODO: change this into a hash with the values being the "replacements" for each command
    
    console.log('connecting...');
    
    socket.on('connect', function() {
      console.log('connect');
    });

    socket.on('message', function(message) {
      var data = message.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); 
     
      commands.forEach(function(command){
                          commandFound = -1;
                          commandFound = message.indexOf(command);
                          if (commandFound > 1) {
                            switch(command) {
                              case "/img":
                                msgParts = message.split(/http/); //Get the http://something as an img src
                                data = data + '<img src="http'+ msgParts[msgParts.length-1] +'" />';
                                break;
                              case "/trollFace":
                                data = data + '<img src="http://25.media.tumblr.com/avatar_6feb8634e3d0_128.png" />';
                                break
                              default:
                                break;
                            }
                          }
                         console.log(commandFound);
                      });
      
      $('#log ul').append('<li>' + data + '</li>');
      window.scrollBy(0, 10000000000000);
      entry_el.focus();
    });

    entry_el.keypress(function(event) {
      if (event.keyCode != 13) return;
      var message = entry_el.attr('value');
      if (message) {
        console.log(message);
        socket.emit('message', message );
        entry_el.attr('value', '');
      }
      else {
        console.log('empty value');
      }
    });
});

