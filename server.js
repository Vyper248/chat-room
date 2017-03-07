const express = require('express');
const app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let moment = require('moment');

app.use(express.static(__dirname+'/public'));

//keep track of connections for each room
let connections = {};

//id to add to anonymous users to tell them apart
let anonymousId = 1;

//emotes to use
let emotes = [
    {text: '<3', emote: 'heart.png'},
    {text: 'XD', emote: 'XD.png'},
    {text: '(hug)', emote: 'hug.png'},
    {text: ':P', emote: 'tongue.png'},
    {text: '8)', emote: 'hearteyes.png'},
    {text: ':O', emote: 'surprised.png'},
    {text: '(kiss)', emote: 'kiss.gif'},
    {text: ':D', emote: 'grin.png'},
    {text: ':(', emote: 'sad.png'},
    {text: ':S', emote: 'worry.gif'},
    {text: '(cry)', emote: 'cry.png'},
    {text: ':)', emote: 'happy.png'},
    {text: '(zombie)', emote: 'zombie.png'},
    {text: '(sleepy)', emote: 'zzz.png'},
    {text: '(onfire)', emote: 'onfire.png'},
    {text: '(cookie)', emote: 'cookie.png'},
    {text: '(ninja)', emote: 'ninja.png'},
    {text: '(sick)', emote: 'sick.png'},
    {text: '(ignoring)', emote: 'ignoring.png'},
    {text: '(cool)', emote: 'cool.png'},
    {text: '(hehe)', emote: 'hehe.png'},
    {text: '(shy)', emote: 'shy.png'},
    {text: '(devil)', emote: 'devil.png'},
    {text: '(inlove)', emote: 'inlove.gif'},
    {text: '(bearhug)', emote: 'bearHug.gif'},
    {text: '(penguin)', emote: 'penguin.gif'},
    {text: '(penguinkiss)', emote: 'penguinKiss.gif'},
    {text: '(heart)', emote: 'heart.gif'}
];

io.on('connection', function(socket){
    //console.log('User connected via socket.io!');

    //keep track of this sockets name and room
    let referer = socket.handshake.headers.referer;
    let name = getParam(referer, 'name') || 'Anonymous'+anonymousId++;
    let room = getParam(referer, 'room') || 'Default';

    socket.join(room);

    //increment the connections for this room, or start at 1 if undefined
    connections[room] ? connections[room]++ : connections[room] = 1;
    io.emit('connections', {connections: connections[room]});

    //send the room details to the new user
    socket.emit('details', {room, name});

    socket.broadcast.to(room).emit('newMember', {name});

    socket.on('message', function(message){
        //console.log('message sent from id: '+id);
        message = checkEmotes(message.text);
        //first broadcast the message to everyone else
        message.owner = 'other';
        message.name = name;
        socket.broadcast.to(room).emit('message', message);

        //then send back to self with different owner set
        message.owner = 'self';
        socket.emit('message', message);
    });

    socket.on('disconnect', function(){
        connections[room]--;
        io.emit('connections', {connections: connections[room]});
        socket.broadcast.to(room).emit('memberLeft', {name});
    });
});

let port = process.env.PORT || 34862;
http.listen(port, function(){
    console.log("Server started on port "+port);
});

//function to get parameters from url
function getParam(url, name){
    if (url.indexOf(name) === -1) return undefined;

    let pairs = url.split('?')[1].split('&');
    for (let i = 0; i < pairs.length; i++){
        if (pairs[i].indexOf(name) !== -1){
            return decodeURIComponent(pairs[i].split('=')[1].replace('+',' '));
        }
    }
}

//function to check text and replace emote text with the emote image tags
function checkEmotes(text){
    let bordered = 'bordered';
    emotes.forEach(function(emote){
        let emoteLength = emote.text.length;
        let emoteText = emote.text;
        emoteText = emoteText.replace('(', '\\(');
        emoteText = emoteText.replace(')', '\\)');

        let re = new RegExp(emoteText, "gi");

        if (text.trim().length === emoteLength && text.match(re)){
            bordered = 'noBorder';
            text = text.replace(re, '<image src="icons/'+emote.emote+'" height="60px"></image>');
        } else {
            text = text.replace(re, '<image src="icons/'+emote.emote+'" height="20px"></image>');
        }
    });

    return {text: text, bordered: bordered};
}
