import os
import json

from flask import Flask
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import Flask, session, render_template, request, redirect, url_for, g



app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# if __name__ == '__main__':
#     socketio.run(app)

rooms = {

"General":[]

}

roomslist = []

#send message to the active chat
@socketio.on('send to general')
def post(data):
    message = data["message"]
    rooms["General"].append(message)
    emit("post message", {"message":message}, broadcast = True)
    #emit('test')


@socketio.on('send to room')
def send_to_room(data):
    message = data["message"]
    rooms[data["room"]] = []
    roomslist.append((data["rooms"]))
    emit("post message", {"message":message})
    #emit('test')

#saves the room name from the client side creation
@socketio.on('new room')
def new_room(data):
    new_room = data["room"]
    rooms[new_room] = []
    roomslist.append(new_room)
    emit('creation successful')


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
