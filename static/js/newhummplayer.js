var newHumm = newHumm || {};
var loaded = false;
var playlistRaw =  [{  UserID : 383, 
                            source: "https://www.youtube.com/watch?v=0FdYTrEujZg",
                            videoId: "0FdYTrEujZg",
                            id: "0FdYTrEujZg",
                            vote: 2,
                            timestamp: "2015-04-23T23:59:43.511Z" },
                    {  UserID : 389, 
                            source: "https://www.youtube.com/watch?v=DLzxrzFCyOs",
                            videoId: "DLzxrzFCyOs", 
                            id: "DLzxrzFCyOs",
                            vote: 7,
                            timestamp: "2015-04-23T23:59:43.511Z" },
                     {  UserID : 323, 
                            source: "https://www.youtube.com/watch?v=VMnPX3GeyEM",
                            videoId: "VMnPX3GeyEM", 
                            id: "VMnPX3GeyEM",
                            vote: 5,
                            timestamp: "2015-04-24T00:01:43.511Z" }];
//playlist 
var playlist = [];
//current song
var current;     
//next item in queue                   
var queued;
//all played items
var played = [];

var player1;
var player2;
var el_player1;
var el_player2;
var player1Ready = false;
var player2Ready = false;
var initialLoad = false;
//next player to use
var currentPlayerNumber = 2;
var currentPlayer;
var nextPlayer;

var currentTimeLeft = 0;
var nextVideoLoaded = false;
var playlistLoaded = false;
var el_timer;
var d3Timer;
//last player status. used to play next if not loaded
var lastStatus = 0;
                 
// onload
window.addEventListener("load",function load(event){
    //console.log("page loaded");
    initialize();
    // call initial rawplaylist update
    loadPlaylistRaw();
    //convertPlaylist();
    window.setInterval(HummUpdate,1000);
    window.setInterval(loadPlaylistRaw,3000);
});



function initialize()
{
    //console.log("initialize()");
    
    //load the youtube api
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    //load the timer div
    d3Timer = radialProgress(document.getElementById('timer-container')).label("Count Down").diameter(200).value(0).render();
}

function onYouTubeIframeAPIReady() {
        //console.log("onYouTubeIframeAPIReady()");
     player1 = new YT.Player('player1', {
          height: '320',
          width: '480',
          events: {
            'onReady': onPlayer1Ready,
            'onStateChange': onPlayer1StateChange
          }
        });
        
        player2 = new YT.Player('player2', {
          height: '320',
          width: '480',
          events: {
            'onReady': onPlayer2Ready,
            'onStateChange': onPlayer2StateChange
          }
        });
 }

function onPlayer1Ready(event, id)
{
    //console.log("player1 ready ");
    el_player1 = $('#player1');
    //console.dir(event);
    //player.loadVideoById(queued.videoId);
    //queueNext();
    player1Ready = true;
    nextPlayer = player1;
}
function onPlayer1StateChange(event)
{
    //console.log("player1 state changed");
    //console.dir(event);
    if (event.data === 0){
        player1.clearVideo();
    }
}

function onPlayer2Ready(event, id)
{
    //console.log("player2 ready");
    el_player2 = $('#player2');
    player2Ready = true;
    currentPlayer = player2;
}
function onPlayer2StateChange(event)
{
    //console.log("player2 state changed");
    if (event.data === 0){
       //unload
        player2.clearVideo();
    }
}


// load raw playlist from server
function loadPlaylistRaw()
{
    var callUrl = "https://shielded-fortress-9407.herokuapp.com/api/all_songs";
    $.ajax({
        url: callUrl,
        context: document.body
        }).done(function(data, status) {
            console.log("raw playlist data returned with status: " + status);
            playlistRaw = data.playlist;
            //console.dir(playlistRaw);
            
            convertPlaylist();
        }).fail(function(data){
            //convert playlist anyway since one exists
            //console.log("suck it i'm converting anyway");
            convertPlaylist();
        });
    
}

// convert raw playlist into properly formatted playlist
function convertPlaylist()
{
    console.log("convertPlaylist()");
    playlistLoaded = true;
    var videoIds = "";
    playlist = [];
    console.log("playlistRaw.length:" + playlistRaw.length);
    for(var i = playlistRaw.length; i > 0; i-=1 )
    {
        //add the id & videoId
        //console.log("covertPlaylisT() forloop");
        //check if item has been played. if it has return
        var result =  $.grep(played,function(e){ return e.videoId === playlistRaw[i-1].id});
        if(result.length > 0)
        {
            console.log("video has been played");
            continue;
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
        var callUrl = "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&key=AIzaSyDlkubarkq7YuarXgtaO2UZco3M7D6QJl4&id=" + videoIds;
        console.dir(callUrl);
        $.ajax({
        url: callUrl,
        context: document.body
        }).success(function(data) {
            console.log("GData ajax call returned");
            addSongs(data);
        });
    }
}

function addSongs(data)
{
    //console.dir(data);
    //console.log("addSongs(): " + data.items.length);
    playlist = [];
    for(var i=data.items.length; i > 0; i-=1)
    {
        //makesure videoId exists
        data.items[i-1].videoId = data.items[i-1].id;
        //console.dir(data);
        //find the video in the rawplaylist to extract votes
        //var voteResults =  $.grep(playlistRaw,function(e){ return e.videoId === playlistRaw[i-1].videoId;});
        var vidVotes = 0;
        for(var p = 0, l = playlistRaw.length; p<l; p+=1)
        {
            if(playlistRaw[p].videoId === data.items[i-1].id)
            {
                vidVotes =playlistRaw[p].vote;
            }
        }
        
        var vid = data.items[i-1];
        var len = convert_time(vid.contentDetails.duration);
        var newSong = {videoId: vid.id, title : vid.snippet.title, thumbnail : vid.snippet.thumbnails.default.url, vote: vidVotes, duration: len };
        //console.dir(newSong);
        playlist.push(newSong);
    }
    
    //console.log("playlist length:" +  playlist.length);
    // sort by votes
    playlist.sort(function(a,b){
        if(a.vote > b.vote){
            return -1;
        } else if(a.vote < b.vote)
        {
            return 1;
        } else {
            return 0;
        }
    });
    
    //if queued is empty, queue next
    //if(queued === undefined || queued === null)
    //{
     //   console.log("queued was null.");
     //   queueNext();
    //}
    
    //update the table
    updateTable();
}

function updateTable()
{
    var tableBody = document.getElementById("song-table");
    if(tableBody!==null && queued !== null)
    {
        var newBody = "";
        //Add the queued item 
        // REMOVE && FALSE TO REENABLE
        if(queued !== undefined && queued !== null && false){
            var rowHTML = "<tr>";
            //rowHTML += '<td "col-md-1"> Next </td>';
            rowHTML += '<td class="col-md-6">' + queued.title + "</td>";  
            rowHTML += '<td>' + '<button type="button" id="testBtn" class="btn btn-success glyphicon glyphicon-thumbs-up" data-loading-text=" ... ">';
            rowHTML += queued.vote;
            rowHTML += '</button>' + "</td>";
            rowHTML += "</tr>";
            newBody += rowHTML;
        }
            
        for(var i = 0, len = playlist.length; i < len; i+=1)
        {
            //console.log("html loop");
            rowHTML = "<tr>";
            //rowHTML += '<td class="col-md-1">' + i + '</td>';
            rowHTML += '<td class="table-image-cell"> <img src="' + playlist[i].thumbnail + '" width:120 height:80 /></td>';
            rowHTML += '<td class="table-title-cell"> <h5>' + playlist[i].title + "</h5></td>";  
            rowHTML += '<td class="table-votes-cell">' + '<button type="button" id="testBtn" class="btn btn-success glyphicon glyphicon-thumbs-up" data-loading-text=" ... ">';
            rowHTML += playlist[i].vote;
            rowHTML += '</button>' + "</td>";
            rowHTML += "</tr>";
            newBody += rowHTML;
        }
        //console.log(newBody);
        tableBody.innerHTML = newBody;
    } else {
        console.log("unable to find table!!!! fml..");
    }
    
}


function playNext()
{
    //
    console.log("playNext()");
    //queue next
    // play the nextplayer
    //change the next player number
    if(currentPlayerNumber==1){
        currentPlayerNumber = 2;
        currentPlayer = player2;
        nextPlayer = player1;
        //swap the css classes
        el_player2.addClass("mainPlayer");
        el_player2.removeClass("secondPlayer");
        el_player1.addClass("secondPlayer");
        el_player1.removeClass("mainPlayer");
    } else {
        currentPlayerNumber = 1;
        currentPlayer = player1;
        nextPlayer = player2;
        // swap classes
        el_player1.addClass("mainPlayer");
        el_player1.removeClass("secondPlayer");
        el_player2.addClass("secondPlayer");
        el_player2.removeClass("mainPlayer");
    }
    
    currentPlayer.playVideo();
    current = queued;
    nextVideoLoaded = false;
}

// load next in line

function queueNext()
{
    //console.log("queueNext()");
    if (playlist.length > 0) {
        //change to get the highest rated current item in the playlist
        //get the highest rated song  
        queued = playlist[0];
        played.push(queued);
        playlist.shift();
        //load in next player
        nextVideoLoaded = true;
        nextPlayer.cueVideoById(queued.videoId);
    } else {
        console.log("playlist length is too short!");
    }
    updateTable();
}

function HummUpdate()
{
    //initial load
    if(!initialLoad && player1Ready && player2Ready && playlistLoaded)
    {
        //console.log("all players ready. Initial load & play");
        initialLoad = true;
        queueNext();
        playNext();
        //play first video
        
    }
    
    if(initialLoad && currentPlayer.getPlayerState() === 1 )
    {
        //console.log("Song time: " + currentPlayer.getCurrentTime() + "/" + current.duration);
        currentTimeLeft = current.duration - currentPlayer.getCurrentTime();
        d3Timer.value(currentTimeLeft).render();
        
        if(currentTimeLeft < 31 && nextVideoLoaded===false)
        {
            //console.log("loading next song due as approaching end");
            queueNext();
        }
        
        if(currentTimeLeft<25 && currentTimeLeft > 5)
        {
            if(nextPlayer.getPlayerState()!=1){
             nextPlayer.playVideo();
            }
            var cv = (currentTimeLeft/25)*100;
            currentPlayer.setVolume(cv);
            nextPlayer.setVolume(100-cv);
            //modify volumne
        }
        if(currentTimeLeft < 15){
            //swap players
            playNext();
        }
    }
    
    // update timeleft
    //currentPlayer.getPlayerState()
}


// HELPER FUNCTIONS
function convert_time(duration) {
    var a = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
        a = [0, a[0], 0];
    }

    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        a = [a[0], 0, a[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        a = [a[0], 0, 0];
    }

    duration = 0;

    if (a.length == 3) {
        duration = duration + parseInt(a[0]) * 3600;
        duration = duration + parseInt(a[1]) * 60;
        duration = duration + parseInt(a[2]);
    }

    if (a.length == 2) {
        duration = duration + parseInt(a[0]) * 60;
        duration = duration + parseInt(a[1]);
    }

    if (a.length == 1) {
        duration = duration + parseInt(a[0]);
    }
    //var h = Math.floor(duration / 3600);
    //var m = Math.floor(duration % 3600 / 60);
    //var s = Math.floor(duration % 3600 % 60);
    //return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
    return duration;
}
