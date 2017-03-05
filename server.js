const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname+'/public'));

io.on('connection', function(){
    console.log('Connected via socket.io!');
});

http.listen(34862, function(){
    console.log("Server started on port 34862");
});
