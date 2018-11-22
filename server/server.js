var express = require('express');
var app = express();

// create server 
var server = app.listen(4000,function(){
    console.log("listening to port 4000");
});
// create io connection
var io = require('socket.io')(server);

// display the html to the client
app.use(express.static('client'));

// listen for users connetcions
// socket - the connection between the user and the server
io.on('connection',function(socket){
    console.log("We have a new connected friend");
    
    // listening for chat events and emit them to 
    // all the users 
    socket.on('spotim/chat', function(data){
        io.sockets.emit('spotim/chat', data);
    });
    //listen for typing events and emit them to 
    // the relevant users 
    socket.on('typing',function(data){
        socket.broadcast.emit('typing',data)
    });
    
    // listen for disconect events
    socket.on('disconnect', function(){
        console.log("One friend leave us");
    })
});
