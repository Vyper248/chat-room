let socket = io();
let currentDate;
let currentName = '';

let audio = new Audio('ding.mp3');

//variables to use for detecting visiability changes, and the event to listen for
let hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

socket.on('connect', function(){
    console.log('Connected to socket.io server!');
});

socket.on('details', function(data){
    $('#roomName').text(data.room);
});

socket.on('message', function(data){
    checkDate();
    if (data.owner !== 'self') checkName(data.name);
    else currentName = '';
    addMessage(data);
    if (document[hidden]) {
        audio.play();
        $('#title').text('New Message!');
    }
});

$('#newMessage').on('keyup', function(e){
    if (e.which === 13){
        var text = $(this).val();
        socket.emit('message', {text: text});
        checkDate();
        //addMessage('self', {text: text});
        $(this).val('');
    }
});

function addMessage(message){
    let time = moment().format('kk:mm');
    let borderClass = message.bordered;
    $('<p>').addClass(message.owner).html('<span class="'+borderClass+'">'+message.text+'</span><span class="time">'+time+'</span>').appendTo('#messages');
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));//scroll to bottom
}

function checkName(name){
    if (name !== currentName){
        $('<p>').addClass('name').text(name).appendTo('#messages');
        currentName = name;
    }
}

function checkDate(){
    let date = moment().format('Do MMMM YYYY');
    if (date !== currentDate){
        $('<p>').addClass('date').text(date).appendTo('#messages');
        currentDate = date;
    }
}

socket.on('connections', function(data){
    let connections = data.connections;
    $('.connections').text(connections);
});

//when user views the page after going away from it, set the title to Chatting App, in case it was changed to New Message
document.addEventListener(visibilityChange, function(){
    if (!document[hidden]) {
        $('#title').text('Chatting App');
    }
});
