

document.addEventListener('DOMContentLoaded', () => {



//clears everything in localStorage; used for testing purposes
//localStorage.clear()


  // //hides the message text area until after the user has submitted a display name
  document.querySelector('textarea').style.display = 'none';
  document.querySelector('#post').style.display = 'none';

//connects socket.io from the flask app once the doc loads
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  //localStorage.clear() //included for testing purposes

//initial values when user loads the webpage
//will let us identify which user is in which chat so we know where to send their messages
  // privateChat == false;
  // inChat == false;

//saves the user's display name in localStorage
if (localStorage.getItem('name')) {
  document.querySelector('#user_form').style.display = 'none';
  document.querySelector('textarea').style.display = 'block';
  document.querySelector('#post').style.display = 'block';
};

  document.querySelector("#save_user").onclick = () => {

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

//does all this as soon as the browser is connected
socket.on('connect', () => {

//identifying the buttons
  post = document.querySelector('#post');



//lets user create new chatrooms
  create.onclick = () => {
    var doc = prompt("Create a new chat!", "Name your chat...")
    var check = document.getElementById(doc)
    if (check != null) {

      alert('That chat room already exists. Pick another name!')
      return false //ends the function

    }

    if (doc == null) {

      alert('Cannot create a room with no name...')
      return false

    }

    var channel = document.querySelector('#General')
    var clone = channel.cloneNode(true);
    clone.querySelector('h4').innerHTML = doc;
    channel.parentNode.appendChild(clone);
    clone.id = doc;
    localStorage.setItem(doc, doc)
    socket.emit('new room', {"room":doc}, {"name":localStorage.getItem("name")})

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
    socket.emit('load all rooms')
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





//posts a message
//we need to save this message in the flask server
  post.onclick = () => {
    const message = document.querySelector('#user_message').value;
    socket.emit('group message', {"message":message});
  };





});

//this isn't working for some reason
socket.on('room created', data => {
  alert(`${data.roomslist}`)
})

socket.on('load successful', data => {
  const modal_room = document.getElementById('modal-room')
  const modal_table = document.getElementById('modal-table')
  const roomslist = `${data.rooms}`
  //const roomslist2 = ['specific', 'another chat']
  for (var i = 0; i < roomslist.length; i++) {
    const clone = modal_room.cloneNode(true)
    clone.querySelector('h3').innerHTML = roomslist[i]
    modal_table.parentNode.appendChild(clone)
  }
  // const clone = modal_room.cloneNode(true)
  // clone.querySelector('h3').innerHTML = roomslist
  // //clone.querySelector('h3').innerHTML = roomslist2
  // modal_table.parentNode.appendChild(clone)


})

//posts message
//must be configured to post message to a specific channel
socket.on('post message', data => {
  const li = document.createElement('li');
  const username = localStorage.getItem('name');
  li.innerHTML = `${username}: ${data.message}`;
  document.querySelector('#messages').append(li);
  document.querySelector('#user_message').value = "";


});



//alerts the channel that a new user has joined the chat
//this should be modified to include which chat the user has joined
socket.on('new user', data => {
  const li = document.createElement('li');

  const username = localStorage.getItem('name');
  li.innerHTML = `${username} has joined the chat`;
  document.querySelector('#messages').append(li);

})


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

function loadRooms() {

  var channel = document.querySelector('#General')


  //append all localStorage elements for chatrooms to the allrooms array
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

//lets user switch active chatrooms
//works for now, but does not remember the active chat
function switchActive(clicked_id) {

  rooms = document.querySelectorAll(".card")
  for (var i = 0; i < rooms.length; i++) {
      rooms[i].classList.remove("active")
  }
  document.getElementById(clicked_id).classList.add("active")
}
