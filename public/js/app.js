var socket = io();

socket.on('connect', function(){
    console.log('Connected to socket.io server!');
});

socket.on('message', function(data){
    console.log('New Message: '+data.text);
    $('<p>').addClass('other').text(data.text).appendTo('.messages');
});

$('.newMessage').on('keyup', function(e){
    if (e.which === 13){
        var text = $(this).val();
        socket.emit('message', {text: text});
        $('<p>').addClass('self').text(text).appendTo('.messages');
        $(this).val('');
    }
});
