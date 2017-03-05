const express = require('express');
const app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static(__dirname+'/public'));

let connections = 0;

io.on('connection', function(socket){
    console.log('User connected via socket.io!');
    connections++;
    io.emit('connections', {connections: connections});

    socket.on('message', function(message){
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', function(){
        connections--;
        io.emit('connections', {connections: connections});
    });
});

let port = process.env.PORT || 34862;
http.listen(port, function(){
    console.log("Server started on port "+port);
});
