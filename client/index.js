// Make connection
var socket = io.connect("https://spotim-demo-chat-server.herokuapp.com");

//Query DOM
var msg = document.getElementById('text_input');
var btn = document.getElementById('send_btn');
var output = document.getElementById('msg_board');
var main_container = document.getElementById('main_container');
var modal = document.getElementById('modal');
var name1 = document.getElementById('name');
var name_btn = document.getElementById('name_btn');
var error_msg = document.getElementById('error');
var user = "";
var menu_welcome = document.getElementById('menu_welcome');
var typing_area = document.getElementById('typing');


// Emit events
// send msg when the user enter "Enter" - main window
msg.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        btn.click();
    }
});

// send msg when the user enter "Enter" - modal window
name1.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        name_btn.click();
    }
});

// when click on the modal btn, check if name 
// were entred, if yes - close modal, else - show
// error msg
name_btn.addEventListener('click', function() {

    if ((name1.value).trim() === "") {
        error_msg.style.display = "block";
        error_msg.style.fontSize = 14;
    } else {
        user = name1.value;
        if (error_msg.style.display === "block") {
            error_msg.style.display = "none";
        }
        modal.style.display = "none";
        menu_welcome.innerText = "Hey " + user + ", welcome!";

    }
});


// when click on send stn (main window) -
// check if the txt box is empty, if not 
// wend the msg to server. 
// change btn color ad clear txt box
btn.addEventListener('click', function() {
    if ((msg.value).trim() != "") {
        var time = new Date();
        var hour = (time.getHours() < 10 ? "0" : "") + time.getHours();
        hour = hour + ":" + (time.getMinutes() < 10 ? "0" : "") + time.getMinutes();
        socket.emit('spotim/chat', {
            avatar: "",
            username: user,
            text: msg.value,
            hour: hour,
            date: time.toLocaleDateString(),
            id: socket.id
        });
        msg.value = "";
        btn.style.background = "rgb(225,225,225)";

    }
    typing_area.innerText = "";
    msg.focus();

});

//when the user is typing (key up event) -
// emit "typing" event every 0.2 sec 
var publish = true;
msg.addEventListener('keyup', function() {
    if (publish == true) {
        socket.emit('typing', {
            user: user
        });
        publish = false;
        setTimeout(() => {
            publish = true;
        }, 200);
    }

});

// when txt box isn't empty - change btn color
// to blue, else - gray
msg.addEventListener('keyup', function() {
    if (msg.value != "")
        btn.style.background = "rgb(130, 224, 255)";
    else
        btn.style.background = "rgb(225,225,225)";
});

// Listen for events

//listen for chat msges and uptade HTML
// for the user msg - shows in diffrent color
// from the rest of the users 
socket.on('spotim/chat', function(data) {
    if (data.id == socket.id) { // another color
        output.innerHTML = output.innerHTML +
            " <div class='msg-box-me'> <strong>" + data.username + "</strong>: " + data.text +
            "<div class='time-right'>" + data.hour + "</div></div>";
    } else {
        output.innerHTML = output.innerHTML +
            "<div class='msg-box'> <strong>" + data.username + "</strong>: " + data.text +
            "<div class='time-right'>" + data.hour + "</div></div>";
    }
});

// listen for typing event and
// update the HTML
// clear it every 0.9 sec
var clearTimerId;
socket.on('typing', function(data) {
    typing_area.innerHTML = "" + data.user + " is typing...";
    //Timer for stop typing - every 0.9 sec
    clearTimeout(clearTimerId);
    clearTimerId = setTimeout(() => {
        typing_area.innerHTML = "";
    }, 900);
});