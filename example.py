import humm
from flask import Flask, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask.ext.cors import CORS
import twilio.twiml
import json
import sys
import os
import logging
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
db = SQLAlchemy(app)

class song(db.Model):
    song_id = db.Column(db.String(20), unique=True)
    name = db.Column(db.String(80))
    vote = db.Column(db.Integer)
    time = db.Column(db.DateTime)

    def __init__(self, song_id, name, vote, time):
        self.song_id = song_id
        self.name = name
        self.vote = vote
        self.time = time

    def __repr__(self):
        return '<Song %s>' % self.song_name


@app.route("/", methods = ['GET', 'POST'])

def hello_monkey():
    msg_body = request.values.get('Body', None)
    msg_from = request.values.get('From', None)

    client_id = '5662fe97ae8c50fb338b4567'
    client_secret = '903210cdd2cc74e4b2660d372c6d734f8d95e814069314d1c3cb784579ec5f7c'
    grant_type = 'client_credentials'


    at = humm.find_authorzation_token(client_id,client_secret,grant_type)

    top_songs = humm.top_songs_request(at, msg_body)

    #for song in top_songs:


    resp = twilio.twiml.Response()

    if(top_songs == 'error: artist_not_found'):
        resp.message("Artist not in repository")
        return str(resp)

    elif(top_songs == 'error: top list not found'):
        resp.message("Top songs not available")
        return str(resp)
    else: 
        print "top_songs part 2: %s" % top_songs
        resp.message("Music added. Hurray!")
        return str(resp)
        return jsonify(top_songs)

    return jsonify({})

@app.route("/api/all_songs", methods = ['GET'])
def all_songs():
    msg_body = request.values.get('Body', None)
    msg_from = request.values.get('From', None)

    client_id = '5662fe97ae8c50fb338b4567'
    client_secret = '903210cdd2cc74e4b2660d372c6d734f8d95e814069314d1c3cb784579ec5f7c'
    grant_type = 'client_credentials'


    at = humm.find_authorzation_token(client_id,client_secret,grant_type)

    top_songs = humm.top_songs_request(at, "madonna")
    top_songs_serialized = []
    for song_name in top_songs.keys():
        video_id = top_songs[song_name]
        vote = 3
        timestamp = "2015/10/12 12:12:12"
        song_obj = {
            'song': song_name,
            'video_id': video_id,
            'vote': vote,
            'time': timestamp,
        }
        top_songs_serialized.append(song_obj)
    return jsonify({'playlist': top_songs_serialized})


if __name__ == '__main__':
    app.run(debug=True)
