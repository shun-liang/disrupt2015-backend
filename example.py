import humm
from flask import Flask, request, redirect, jsonify
import twilio.twiml
import json
import sys
import logging
app = Flask(__name__)
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)

@app.route("/", methods = ['GET', 'POST'])

def hello_monkey():
    msg_body = request.values.get('Body', None)
    msg_from = request.values.get('From', None)

    client_id = '5662fe97ae8c50fb338b4567'
    client_secret = '903210cdd2cc74e4b2660d372c6d734f8d95e814069314d1c3cb784579ec5f7c'
    grant_type = 'client_credentials'


    at = humm.find_authorzation_token(client_id,client_secret,grant_type)

    top_songs = humm.top_songs_request(at, msg_body)

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
    return jsonify(top_songs)


if __name__ == '__main__':
    app.run(debug=True)
