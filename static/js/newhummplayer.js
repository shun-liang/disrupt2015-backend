var newHumm = newHumm || {};

var playlistRaw =  [{  UserID : 383, 
                            source: "https://www.youtube.com/watch?v=0FdYTrEujZg",
                            videoId: "0FdYTrEujZg", 
                            votes: 2,
                            timestamp: "2015-04-23T23:59:43.511Z" },
                     {  UserID : 323, 
                            source: "https://www.youtube.com/watch?v=VMnPX3GeyEM",
                            videoId: "VMnPX3GeyEM", 
                            votes: 2,
                            timestamp: "2015-04-24T00:01:43.511Z" }];
var playlist = [];
                            
var queued;
        
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
    
    //once api is loaded continue
    
    
    //populate playlist
    //newHumm.playerlist = //AJAX CALL
    
}

function onYouTubeIframeAPIReady() {
        console.log("onYouTubeIframeAPIReady()");
        queueNext();
     player = new YT.Player('player1', {
          height: '270',
          width: '480',
          //videoId: queued.videoId,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
 }

function onPlayerReady(event)
{
    console.log("player ready");
    console.dir(event);
    //player.loadVideoById(queued.videoId);
    //queueNext();
    playNext();
}
function onPlayerStateChange(event)
{
    console.log("state changed");
    console.dir(event);
    if (event.data === 0){
        playNext();
    }
}
// load son;
function playNext()
{
    //
    console.log("playNext()");
    
    //if authorized play
    
    //if not authorized reload self
    
    //queue next
    player.loadVideoById(queued.videoId);
    queueNext();
}

// load next in line

function queueNext()
{
    if (playlist.length > 0) {
        var next = playlist[0];
        playlist.shift();
        queued = {  UserID : next.UserID, 
                                source: next.source,
                                videoId: next.videoId,
                                votes: next.votes,
                                timestamp: next.timestamp };    
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


