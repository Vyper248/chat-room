const express = require('express');
const app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname+'/public'));

http.listen(34862, function(){
    console.log("Server started on port 34862");
});
