var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var i=0;

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
  socket.on('send message', function(config){
    if(config.option=="init"){
      config["idGame"]=(i++);
    }
    io.emit('send message', config);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});