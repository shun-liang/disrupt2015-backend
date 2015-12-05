import unirest

def find_authorzation_token(client_id,client_secret,grant_type):
    response=unirest.post('https://api.myhumm.com/token', 
            params ={'client_id':client_id,
            'client_secret':client_secret,
            'grant_type':grant_type})  
    return response.body['data_response']['access_token']

def find_artist_id(authorzation_token,artist):
    string="https://humm-api.p.mashape.com/artists?auth="+authorzation_token+"&keyword="+artist
    response = unirest.get(string,
                           headers={
                                    "X-Mashape-Key": "m78ha7jd57msh8cdt9qLh4maGu8dp1DhHlljsnzcpHjUoYYnLJ",
                                    "Accept": "application/json"})
    
    if response.body['data_response']==[]:
        return 'artist_not_found'
    else:
        return response.body['data_response'][0]['_id']

def find_top_songs(authorzation_token,artist_id):
    string='https://humm-api.p.mashape.com/artists/'+artist_id+'/topsongs?auth='+authorzation_token
    
    response = unirest.get(string,
                           headers={
                                    "X-Mashape-Key": "m78ha7jd57msh8cdt9qLh4maGu8dp1DhHlljsnzcpHjUoYYnLJ",
                                    "Accept": "application/json"})
    
    if response.code == 204:
        return 'top list not found'
    else:
        youtube_first_link=response.body['data_response'][0]['foreign_ids']['youtube']
        first_name = response.body['data_response'][0]['title']
        youtube_second_link=response.body['data_response'][1]['foreign_ids']['youtube']
        second_name = response.body['data_response'][1]['title']
        youtube_third_link=response.body['data_response'][2]['foreign_ids']['youtube']
        third_name = response.body['data_response'][2]['title']
        dic = {first_name: youtube_first_link, second_name: youtube_second_link, third_name: youtube_third_link}
        return dic

        
authorzation_token=find_authorzation_token(client_id,client_secret,grant_type)

def top_songs_request(authorzation_token,message):
    #function that returns the top songs of an artist
    try:
        artist_id=find_artist_id(authorzation_token,message)
        if artist_id != 'artist_not_found':
            top_songs = find_top_songs(authorzation_token,artist_id)
            return top_songs

            if top_songs == 'top list not found':
                return 'error: top list not found'
        else:
            return 'error: artist_not_found'
    except:
        print 'find new auth token'
        authorzation_token=find_authorzation_token(client_id,client_secret,grant_type)
        return top_songs_request(authorzation_token,message)
