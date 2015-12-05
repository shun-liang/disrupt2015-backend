import humm
from flask import Flask, request, redirect
import twilio.twiml
import json
app = Flask(__name__)


@app.route("/", methods = ['GET', 'POST'])

def hello_monkey():
	msg_body = request.values.get('Body', None)
	msg_from = request.values.get('From', None)

	client_id = '5663510cae8c502d4f8b456a'
	client_secret = 'ba9488a4ea2efcc0fef6d4ba71888ad29e8cfd616c94db77a47343879fccedab'
	grant_type = 'client_credentials'


	at = humm.find_authorzation_token

	top_songs = top_songs_request(at, msg_body)

	resp = twilio.twiml.Response()

	if(top_songs == 'error: artist_not_found'):
		resp.message("Artist not in repository")

	elif(top_songs == 'error: top list not found'):
		resp.message("Top songs not available")
	else: 
		resp.message("Music added. Hurray!")
		return jsonify(top_songs)

	return jsonify({})