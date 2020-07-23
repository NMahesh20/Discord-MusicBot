var request = require("request");
var fs=require("fs");

//First login into spotify and create Developer account
//Get user id from "https://www.spotify.com/in/account/overview/"
var user_id="31hvqm6f5uoe236rykh6kps6wj6u";

//Get it From https://developer.spotify.com/console/get-current-user-saved-tracks/ click get OAuth token and select user-library-read
var token="BQB5z7I4glIEcfi6BHVshDqNhUkOZVkmgV99OwETpzZJWfXEgoVjkzBGaM45Sz6QzjeG5Kp2UBqW9gm8wOQE-dEom5KuNHnUVCFXCX7hTIyy4NSsLjnnrGjWi2kJl2kudTzlWVZf69t2CQliXZPkpoEO4IBz8mwqqc1srrK7IzK5FlYal4dlyzXqqQ"

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
                yts( playlists.items[i].track.name+" song", function ( err, r ) {
                    if(err) return console.error(err);
                    const videos = r.videos;
                    writeStream.write("!play " +videos[0].url+"\r\n")
                  } )
                }
			}
		}
	}
)

