var newHumm = newHumm || {};
var loaded = false;
var playlistRaw =  [{  UserID : 383, 
                            source: "https://www.youtube.com/watch?v=0FdYTrEujZg",
                            videoId: "0FdYTrEujZg", 
                            votes: 2,
                            timestamp: "2015-04-23T23:59:43.511Z" },
                    {  UserID : 389, 
                            source: "https://www.youtube.com/watch?v=DLzxrzFCyOs",
                            videoId: "DLzxrzFCyOs", 
                            votes: 7,
                            timestamp: "2015-04-23T23:59:43.511Z" },
                     {  UserID : 323, 
                            source: "https://www.youtube.com/watch?v=VMnPX3GeyEM",
                            videoId: "VMnPX3GeyEM", 
                            votes: 1,
                            timestamp: "2015-04-24T00:01:43.511Z" }];
var playlist = [];

//playlist 
var playlist = [];     
//next item in queue                   
var queued;
 
//all played items
var played = [];

var player;                 
// onload
window.addEventListener("load",function load(event){
    console.log("loaded");
    initialize();
});


function initialize()
{
    console.log("initialize()");
    var returnObj = {};
    
    // get the player divs
    returnObj.player1 = document.getElementById("player1");
    
    //load the youtube api
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // update playlist from playlist raw
    
    
    //populate playlist
    //newHumm.playerlist = //AJAX CALL
    
}

function onYouTubeIframeAPIReady() {
        console.log("onYouTubeIframeAPIReady()");
        //queueNext();
     player = new YT.Player('player1', {
          height: '480',
          width: '600',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
 }

function onPlayerReady(event)
{
    console.log("player ready");
    //console.dir(event);
    //player.loadVideoById(queued.videoId);
    //queueNext();
    convertPlaylist();
}
function onPlayerStateChange(event)
{
    console.log("state changed");
    //console.dir(event);
    if (event.data === 0){
        playNext();
    }
}


// convert raw playlist into properly formatted playlist
function convertPlaylist()
{
    console.log("convertPlaylist()");
    var videoIds = "";
    playlist = [];
    //console.log("playlistRaw.length:" + playlistRaw.length);
    for(var i = playlistRaw.length; i > 0; i-=1 )
    {
        //console.log("covertPlaylisT() forloop");
        //check if item has been played
        var result =  $.grep(played,function(e){ return e.videoId == playlistRaw[i-1].videoId});
        
        if(result.length > 0)
        {
            console.log("video has been played");
            return;
        }
        
        //add comma if not first item to videoIds string
        if(videoIds != "")
        {
           videoIds += ","; 
        }
        
        //add video id
        videoIds += playlistRaw[i-1].videoId;
    }
    
    //ajax call to google data api if its not empty
    if(videoIds!=="")
    {
        var callUrl = "https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyDlkubarkq7YuarXgtaO2UZco3M7D6QJl4&id=" + videoIds;
        $.ajax({
        url: callUrl,
        context: document.body
        }).done(function(data) {
            addSongs(data);
            playNext();
        });
    }
}

function addSongs(data)
{
    console.log("addSongs()");
    //playlist = [];
    for(var i=data.items.length; i > 0; i-=1)
    {
        
        //find the video in the rawplaylist to extract votes
        var voteResults =  $.grep(playlistRaw,function(e){ return e.videoId == playlistRaw[i-1].videoId;});
        var vidVotes = 0;
        for(var k = voteResults.length; k > 0; k-=1)
        {
            vidVotes += voteResults[k-1].votes;
        }
        
        var vid = data.items[i-1];
        var newSong = {videoId: vid.id, title : vid.snippet.title, thumbnail : vid.snippet.thumbnails.default.url, votes: vidVotes };
        playlist.push(newSong);
    }
    
    console.log("playlist length:" +  playlist.length);
    // sort by votes
    playlist.sort(function(a,b){
        if(a.votes > b.votes){
            return -1;
        } else if(a.votes < b.votes)
        {
            return 1;
        } else {
            return 0;
        }
    })
    
    console.log("playlist sorted");
    for(var q = playlist.length; q > 0; q-=1)
    {
        console.dir(playlist[q-1]);
    }
    
    //if queued is empty, queue next
    if(queued === undefined)
    {
        queueNext();
    }
    
    //update the table
}

function updateTable()
{
    
}


function playNext()
{
    //
    console.log("playNext()");
    //queue next
    player.loadVideoById(queued.videoId);
    queueNext();
}

// load next in line

function queueNext()
{
    console.log("queueNext()");
    
    var currentHighest = 0;
    
    if (playlist.length > 0) {
        //change to get the highest rated current item in the playlist
        //get the highest rated song
        
        queued = playlist[0];
        played.push(queued);
        playlist.shift();
    }
}

function updateList()
{
    var l = playlist.length;
    for(var i; i < l; i+= 1)
    {
        var song = {};
    }
}


