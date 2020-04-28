import os

from flask import Flask
from flask_socketio import SocketIO, emit
from flask import Flask, session, render_template, request, redirect, url_for, g

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("group message")
def post(data):
    message = data["message"]
    emit("post message", {"message":message}, broadcast=True)
