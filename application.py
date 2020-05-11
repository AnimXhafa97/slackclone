import os
import json

from flask import Flask
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import Flask, session, render_template, request, redirect, url_for, g

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

#dictionary holds channel names and messages in each room. Load this up to 100
#since the channel names are held in local storage (and specific to each user), this will hold MESSAGES
#experiment with using a nested dictionary
#why do we need a nested dictionary when every message has the username next to it? Just save the message as is...
rooms = {

"general":[],
"test room":[]

}

roomslist = ["General", "specific", "really specific"]


@app.route("/", methods = ["GET"])
def index():
    return render_template("index.html")

#send message to the general chat
@socketio.on("group message")
def post(data):
    message = data["message"]
    rooms["general"].append(message)
    emit("post message", {"message":message}, broadcast=True)

@socketio.on("new room")
def newroom(data):
    user = data["name"]
    rooms[data["room"]] = []
    roomslist.append(data["room"])
    join_room(rooms[data["room"]])
    emit('room created', {"rooms":[roomslist]})

@socketio.on("load all rooms")
def loadAll():
    emit('load successful', {"rooms":json.dumps(roomslist)})

@socketio.on("join")
def join():
    pass


@socketio.on("leave")
def leave():
    pass
