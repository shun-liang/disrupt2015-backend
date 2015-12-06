import unirest
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

def find_authorzation_token(client_id,client_secret,grant_type):

    #print "client_id: " + client_id + " client_secret:" + client_secret + " grant_type: " + grant_type
    response=unirest.post('https://api.myhumm.com/token', 
            params ={'client_id':client_id,
            'client_secret':client_secret,
            'grant_type':grant_type}) 
    #print response.body['data_response']['access_token']
    return response.body['data_response']['access_token']

def find_artist_id(authorzation_token,artist):
    string="https://humm-api.p.mashape.com/artists?auth="+authorzation_token+"&keyword="+artist
    response = unirest.get(string,
                           headers={
                                    "X-Mashape-Key": "m78ha7jd57msh8cdt9qLh4maGu8dp1DhHlljsnzcpHjUoYYnLJ",
                                    "Accept": "application/json"})
    
    if response.body['data_response']==[]:
        return 'error: artist_not_found'
    else:
        return response.body['data_response'][0]['_id']

def find_top_songs(authorzation_token,artist_id):
    string='https://humm-api.p.mashape.com/artists/'+artist_id+'/topsongs?auth='+authorzation_token
    
    response = unirest.get(string,
                           headers={
                                    "X-Mashape-Key": "m78ha7jd57msh8cdt9qLh4maGu8dp1DhHlljsnzcpHjUoYYnLJ",
                                    "Accept": "application/json"})
    
    print "response code: %s" % response.code
    if response.code != 200:
        return 'error: top list not found'
    else:
        youtube_first_link=response.body['data_response'][0]['foreign_ids']['youtube']
        first_name = response.body['data_response'][0]['title']
        youtube_second_link=response.body['data_response'][1]['foreign_ids']['youtube']
        second_name = response.body['data_response'][1]['title']
        youtube_third_link=response.body['data_response'][2]['foreign_ids']['youtube']
        third_name = response.body['data_response'][2]['title']
        dic = {first_name: youtube_first_link, second_name: youtube_second_link, third_name: youtube_third_link}
        return dic

        

def top_songs_request(authorzation_token,message):
    #function that returns the top songs of an artist
    #try:
    artist_id=find_artist_id(authorzation_token,message)
    if artist_id != 'error: artist_not_found':
        top_songs = find_top_songs(authorzation_token,artist_id)

        if top_songs == 'error: top list not found':
            return 'error: top list not found'
        else:
            return top_songs
    else:
        return 'error: artist_not_found'
    #except Exception, e:
    #    print 'Exception: %s' % str(e)
        # client_id = '5662fe97ae8c50fb338b4567'
        # client_secret = '903210cdd2cc74e4b2660d372c6d734f8d95e814069314d1c3cb784579ec5f7c'
        # grant_type = 'client_credentials'

        # authorzation_token=find_authorzation_token(client_id,client_secret,grant_type)
        # return top_songs_request(authorzation_token,message)
