let socket = io();
let currentDate;

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
    {text: ':S', emote: 'S.png'},
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
    {text: '(heart)', emote: 'heart.gif'},

];

socket.on('connect', function(){
    console.log('Connected to socket.io server!');
});

socket.on('message', function(data){
    checkDate();
    addMessage('other', data);
});

$('#newMessage').on('keyup', function(e){
    if (e.which === 13){
        var text = $(this).val();
        socket.emit('message', {text: text});
        checkDate();
        addMessage('self', {text: text});
        $(this).val('');
    }
});

function addMessage(owner, message){
    let time = moment().format('kk:mm');
    messageParams = checkEmotes(message.text);
    message.text = messageParams.text;
    let borderClass = messageParams.bordered;
    $('<p>').addClass(owner).html('<span class="'+borderClass+'">'+message.text+'</span><span class="time">'+time+'</span>').appendTo('#messages');
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));//scroll to bottom
}

function checkEmotes(text){
    let bordered = 'bordered';
    emotes.forEach(function(emote){
        let emoteLength = emote.text.length;
        let emoteText = emote.text;
        emoteText = emoteText.replace('(', '\\(');
        emoteText = emoteText.replace(')', '\\)');

        let re = new RegExp(emoteText, "gi");

        if (text.trim().length === emoteLength){
            bordered = 'noBorder';
            text = text.replace(re, '<image src="icons/'+emote.emote+'" height="60px"></image>');
        } else {
            text = text.replace(re, '<image src="icons/'+emote.emote+'" height="20px"></image>');
        }
    });

    return {text: text, bordered: bordered};
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
