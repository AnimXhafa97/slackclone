import os
import json

from flask import Flask
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import Flask, session, render_template, request, redirect, url_for, g



app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

rooms = {

"General":[]

}

roomslist = []




#send message to the active chat
@socketio.on("group message")
def post(data):
    message = data["message"]
    active_room = data["room"]
    rooms[active_room].append(message)
    emit("post message", {"message":message}, broadcast = True)


@socketio.on("new room")
def new_room(data):
    # user = data["name"]
    new_room = data["room"]
    rooms[new_room] = []
    roomslist.append(new_room)
    #emit('add room', {"roomslist":roomslist})
    emit('creation successful')
    #emit('test', {"test":rooms})

#lets test the jinja again...
#jinja2 for loop is working for now, albeit slow; I might revisit this after I finish other functions
@socketio.on('available rooms')
def available():
    pass

@socketio.on("join")
def join():
    pass

@socketio.on("leave")
def leave():
    pass

@app.route("/")
def index():
    return render_template("index.html", rooms = roomslist)
