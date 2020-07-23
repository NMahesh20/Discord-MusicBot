var request = require("request");
var fs=require("fs");

//First login into spotify and create Developer account
//Get user id from "https://www.spotify.com/in/account/overview/"
var user_id="<your user_id>";

//Get it From https://developer.spotify.com/console/get-current-user-saved-tracks/ click get OAuth token and select user-library-read
var token="<Your token>"

var playlists_url="https://api.spotify.com/v1/users/"+user_id+"/tracks?limit=50";
var writeStream = fs.createWriteStream("./YoutubeLinks.txt",{flags:"a"});

const yts = require( 'yt-search' )

request({url:playlists_url, headers:{"Authorization":"Bearer "+token}}, function(err, res){
	if (res){
        var playlists=JSON.parse(res.body);	
        if("error" in playlists){console.log(playlists.error)}
        else{
            for(i in playlists.items){
                console.log(playlists.items[i].track.name)
                yts( playlists.items[i].track.name, function ( err, r ) {
                    if(err) return console.error(err);
                    const videos = r.videos;
                    writeStream.write("!play " +videos[0].url+"\r\n")
                  } )
                }
			}
		}
	}
)

