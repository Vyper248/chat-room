const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname+'/public'));

io.on('connection', function(socket){
    console.log('Connected via socket.io!');

    socket.on('message', function(message){
        console.log('Message received: '+message.text)
        socket.broadcast.emit('message', message);
    });
});

var port = process.env.PORT || 34862;
http.listen(port, function(){
    console.log("Server started on port "+port);
});
