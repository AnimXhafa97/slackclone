//potential problem, the new user function that takes a username should not run every time the page is
//visited since it can be visited by previous users

//use window.localStorage to store data client-side, such as people's username

//Using localStorage we can store the username in the browser, and only display the form initially if
//there is nothing in localStorage. This does not allow a user to make multiple accounts, but we can handle that
//with some additional functionality later.

//NOW:

//Use the singlepage.html approach from the lecture to make the form disappear once it is submitted.
//Find a way to still test if your new_user was saved in localStorage; may involve removing the form tags :'(

document.addEventListener('DOMContentLoaded', () => {

  // //hides the message text area until after the user has submitted a display name
  document.querySelector('textarea').style.display = 'none';
  document.querySelector('#post').style.display = 'none';

//connects socket.io from the flask app once the doc loads
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  //localStorage.clear() //included for testing purposes


//save username function
//this needs to be improved to automatically hide the form if a username exists in localStorage
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

//when connected, configure the post button to be able to post messages from the textarea
socket.on('connect', () => {

  //ONLY THE POST BUTTON should work for now. The other buttons will be configured after this functionality is tested
  //takes whatever is in the textarea and posts it as the inner html of the unordered list
  post = document.querySelector('#post');
  join = document.querySelectorAll('.join');

  //creates button functionality allowing emitting of message
  post.onclick = () => {
    const message = document.querySelector('#user_message').value
    socket.emit('group message', {"message":message});

//all this does is configure the button

  };

for (var i = 0; i < join.length; i++) {
  join[i].onclick = () => {
    socket.emit('enter chat')
  }
}
});


//client receives information from server
socket.on('post message', data => {
  const li = document.createElement('li');
  const username = localStorage.getItem('name')
  li.innerHTML = `${username}: ${data.message}`;
  document.querySelector('#messages').append(li);
  document.querySelector('#user_message').value = "";
});

//alerts the channel that a new user has joined the chat
socket.on('new user', data => {
  const li = document.createElement('li');
  const username = localStorage.getItem('name');
  li.innerHTML = `${username} has joined the chat`;
  document.querySelector('#messages').append(li);
})

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


//creates a new channel when a specific class of button is clicked
//this function still needs to SAVE the channels when the page is reloaded
//consider appending these to a json object and then reading the data server-side to load it
function newChannel() {
  var doc = prompt("Enter chat name", "Nameless Chat")
  if (doc != null) {
    var channel = document.querySelector('#channel')
    var clone = channel.cloneNode(true);
    clone.id = doc;
    clone.querySelector('h4').innerHTML = doc;
    channel.parentNode.appendChild(clone);
    //clone.querySelector('h1').innerHTML = doc;
  };
}
