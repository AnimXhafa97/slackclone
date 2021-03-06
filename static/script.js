

document.addEventListener('DOMContentLoaded', () => {

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

//load the current chatrooms from localStorage
  var channel = document.querySelector('#General')
  for (var i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i) != "name" && localStorage.key(i) != "debug") {
      var clone = channel.cloneNode(true)
      clone.querySelector('h4').innerHTML = localStorage.getItem(localStorage.key(i));
      channel.parentNode.appendChild(clone);
      clone.id = localStorage.key(i);
      clone.className = "card"


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

    //handles nulls
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
    socket.emit('new room', {"room":doc}) //saves the room name serverside

  };

//inefficient: reloads the page so the jinja2 for loop will work on index.html
//i need to find a better way for this to work...
  socket.on('creation successful', data => {
    location.reload()
  })


//post message to the active room
  post.onclick = () => {
    var message = document.querySelector('#user_message').value;
    var room = document.querySelector('.active').id
    if (room == "General") {
      socket.emit('send to general', {"message":message})
    }
    else if (room !== "General") {
      socket.emit('send to room', {"message":message, "room":room});
    }

  }

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



}}});
})

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


//switches chatroom class name to active
function switchActive(clicked_id) {

  rooms = document.querySelectorAll(".card")
  for (var i = 0; i < rooms.length; i++) {
      rooms[i].classList.remove("active")
  }
  document.getElementById(clicked_id).classList.add("active")
}
