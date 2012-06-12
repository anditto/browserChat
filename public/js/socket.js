$(document).ready(function() {
    var entry_el = $('#entry');
    var socket = new io.connect(window.location.hostname);
    console.log('connecting...');

    socket.on('connect', function() {
      console.log('connect');
      });

    socket.on('message', function(message) {
      var data = message.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
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

