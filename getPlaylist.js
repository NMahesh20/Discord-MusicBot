var request = require("request");
var fs=require("fs");
//First login into spotify and create Developer account

//Get OAuth token form "https://developer.spotify.com/console/get-current-user-playlists/" and press get Token select playlist-read-private
var token = "<your token>"

var writeStream = fs.createWriteStream("./YoutubeLinks.txt",{flags:"a"});

//Youtube Search
const yts = require( 'yt-search' )

  
var playlists_url="https://api.spotify.com/v1/users/me/playlists?limit=50";

request({url:playlists_url, headers:{"Authorization":"Bearer "+token}}, function(err, res){
	if (res){
        var playlists=JSON.parse(res.body);	
        if("error" in playlists){console.log(playlists.error)}
        else if("undefined"===typeof(playlists.items[0])){
          console.log("Users has the no playlists.\nTry Using getLikedMusic.js.")
        }
        else{
          console.log(typeof(playlists))
        var playlist_url = playlists.items[0].href;
		request({url:playlist_url, headers:{"Authorization":"Bearer "+token}}, function(err, res){
			if (res){
				var playlist = JSON.parse(res.body);
				console.log("playlist: " + playlist.name);
				playlist.tracks.items.forEach(function(track){
                    console.log(track.track.name)
                    yts( track.track.name, function ( err, r ) {
                      if(err) return console.error(err);
                      const videos = r.videos;
                      writeStream.write("!play " +videos[0].url+"\r\n")
                    } )
				});
			}
		})		
	}}
})
