var request = require("request");
var fs=require("fs");
//First login into spotify

//Get your user id from https://www.spotify.com/in/account/overview/
var user_id="<Your user id>";

//Get OAuth token form "https://developer.spotify.com/console/get-current-user-playlists/" and press get Token select playlist-read-private
var token = "<Your token>"

//Location of the file
const fileLoc="./YoutubeLinks.txt"
var writeStream = fs.createWriteStream(fileLoc,{flags:"a"});

//Youtube Search
const yts = require( 'yt-search' );
  
var playlists_url="https://api.spotify.com/v1/users/"+user_id+"/playlists?limit=50";

request({url:playlists_url, headers:{"Authorization":"Bearer "+token}}, function(err, res){
	if (res){
        var playlists=JSON.parse(res.body);	
        if("error" in playlists){console.log(playlists.error)}
        else if("undefined"===typeof(playlists.items[0])){
          console.log("Users has the no playlists.\nTry Using getLikedMusic.js.")
        }
        else{
          var indexes=Object.keys(playlists.items)
          for (var i in indexes){
        var playlist_url = playlists.items[i].href;
		request({url:playlist_url, headers:{"Authorization":"Bearer "+token}}, function(err, res){
			if (res){
				var playlist = JSON.parse(res.body);
				console.log("playlist: " + playlist.name);
				playlist.tracks.items.some(function(track){
          if(track.hasOwnProperty("track") ){
            if(null!=track.track){
                    yts( track.track.name+" song", function ( err, r ) {
                      if(err){
                        if(err.code=="ECONNRESET"){console.log("\nToo many YouTube Search Requests.\nO_o\nThat should be enough. Closing the search.")
                          process.exit()}
                        return console.error(err);
                      } 
                      const videos = r.videos;
                      writeStream.write("!play " +videos[0].url+"\r\n")
                    } )
        }}});
			}
		})		
	}}}
})
