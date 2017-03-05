var socket = io();

socket.on('connect', function(){
    console.log('Connected to socket.io server!');
});

socket.on('message', function(data){
    addMessage('other', data.text);
});

$('.newMessage').on('keyup', function(e){
    if (e.which === 13){
        var text = $(this).val();
        socket.emit('message', {text: text});
        addMessage('self', text);
        $(this).val('');
    }
});

function addMessage(owner, message){
    $('<p>').addClass(owner).html('<span class="bordered">'+message+'</span>').appendTo('.messages');
}
