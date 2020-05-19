

document.addEventListener('DOMContentLoaded', () => {

var private_chat = false
var in_room = false

//clears everything in localStorage; used for testing purposes
//localStorage.clear()

  // //hides the message text area until after the user has submitted a display name
  document.querySelector('textarea').style.display = 'none';
  document.querySelector('#post').style.display = 'none';

//connects socket.io from the flask app once the doc loads
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

//displays or hides DOM elements if user has submitted a display name or not
if (localStorage.getItem('name')) {
  document.querySelector('#user_form').style.display = 'none';
  document.querySelector('textarea').style.display = 'block';
  document.querySelector('#post').style.display = 'block';
};

//saves the user's display name in localStorage
  document.querySelector("#save_user").onclick = () => {

    if (!localStorage.getItem('name')) {
      var new_user = document.getElementById('new_user');
      localStorage.setItem('name', new_user.value);
    }
    var name = localStorage.getItem('name');
    document.getElementById('user_form').style.display = "none";
    document.querySelector('textarea').style.display = 'block'
    document.querySelector('#post').style.display = 'block'
    return false
  };


  //modal functionality for joining rooms
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var join = document.getElementById("join");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  join.onclick = function() {
    modal.style.display = "block";
    socket.emit('available rooms')
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }



//does all this as soon as the browser is connected
socket.on('connect', () => {

//declaring the buttons
  post = document.querySelector('#post');

//lets user create new chatrooms and appends them to the sidebar
  create.onclick = () => {
    var doc = prompt("Create a new chat!", "Name your chat...")
    var check = document.getElementById(doc)
    //handles duplicate room names
    if (check != null) {

      alert('That chat room already exists. Pick another name!')
      return false //ends the function

    }

    //handles null room name
    if (doc.length == 0) {

      alert('Cannot create a room with no name...')
      return false

    }

    //handles case where user clicks cancel on prompt
    if (doc == null) {
      return false
    }

    //creates the clone
    var channel = document.querySelector('#General')
    var clone = channel.cloneNode(true);
    clone.querySelector('h4').innerHTML = doc;
    channel.parentNode.appendChild(clone);
    clone.id = doc;
    localStorage.setItem(doc, doc)
    socket.emit('new room', {"room":doc})

  };

//inefficient: reloads the page so the jinja2 for loop will work on index.html
  socket.on('creation successful', data => {
    location.reload()
  })

//used to test outputs of sockets
// socket.on('test', data => {
//   console.log(`${data.test}`);
// })

//posts a message
//we need to save this message in the flask server
  post.onclick = () => {
    var message = document.querySelector('#user_message').value;
    var room = document.querySelector('.active').id
    //var some_data = {'message':message, 'room':room}
    socket.emit('general message', {'message':message, 'room':room});
  };



//socket.on instances here ________________________________________

//posts messages
//does not yet post to a specific channel
  socket.on('post message', data => {
    const li = document.createElement('li');
    const username = localStorage.getItem('name');
    li.innerHTML = `${username}: ${data.message}`;
    document.querySelector('#messages').append(li);
    document.querySelector('#user_message').value = "";


  });


//new user has joined chat
//useless right now
  socket.on('new user', data => {
    const li = document.createElement('li');
    const username = localStorage.getItem('name');
    li.innerHTML = `${username} has joined the chat`;
    document.querySelector('#messages').append(li);

  })



});


//functions here

//function executes on click once user has submitted display name, saves the name in local storage
function saveUser() {

  if (!localStorage.getItem('name')) {
    var new_user = document.getElementById('new_user');
    localStorage.setItem('name', new_user.value);
  }
  var name = localStorage.getItem('name');
  //document.querySelector('#test').innerHTML = localStorage.getItem('name');
  document.getElementById('user_form').style.display = "none";
  document.querySelector('textarea').style.display = 'block'
  document.querySelector('#post').style.display = 'block'
  return false
};

});

//loads all the current chatrooms from the user's localStorage to the user's sidebar
function loadRooms() {

  var channel = document.querySelector('#General')
  for (var i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) != "name" && localStorage.key(i) != "debug") {
      var clone = channel.cloneNode(true)
      clone.querySelector('h4').innerHTML = localStorage.getItem(localStorage.key(i));
      channel.parentNode.appendChild(clone);
      clone.id = localStorage.key(i);
      clone.className = "card"
    };
  };
};

//switches chatroom class name to active
function switchActive(clicked_id) {
  rooms = document.querySelectorAll(".card")
  for (var i = 0; i < rooms.length; i++) {
      rooms[i].classList.remove("active")
  }
  document.getElementById(clicked_id).classList.add("active")
}
