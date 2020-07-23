var request = require("request");
var fs=require("fs");
//First login into spotify and create Developer account
//Get user id from "https://www.spotify.com/in/account/overview/"
var user_id = "<Your Spotify UserID>";

//Get OAuth token form "https://developer.spotify.com/console/get-current-user-playlists/" and press get Token select playlist-read-private
var token = "<Your Spotify OAuth token"

var writeStream = fs.createWriteStream("./YoutubeLinks.txt",{flags:"a"});

//Youtube Search
const yts = require( 'yt-search' )

  
var playlists_url="https://api.spotify.com/v1/users/"+user_id+"/playlists";

request({url:playlists_url, headers:{"Authorization":"Bearer "+token}}, function(err, res){
	if (res){
        var playlists=JSON.parse(res.body);	
        if("error" in playlists){console.log("The  token is expired. Please set the OAuth token.")}
        else{
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
