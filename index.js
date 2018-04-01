var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/jogo', function(req, res){
  res.sendFile(__dirname + '/js/jogo.js');
});

app.get('/jquery', function(req, res){
  res.sendFile(__dirname + '/js/jquery.js');
});

io.on('connection', function(socket){
  socket.on('sendRound message', function(config){
    console.log(config);
    io.emit('sendRound message', config);
  });

  socket.on('callRound message', function(config){
    console.log(config);
    io.emit('callRound message', config);
  });

  socket.on('sendMap message', function(config){
    console.log(config);
    io.emit('sendMap message', config);
  });

  socket.on('available message', function(config){
    console.log(config);
    io.emit('available message', config);
  });

  socket.on('endGame message', function(config){
    console.log(config);
    io.emit('endGame message', config);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
