var request = require("request");
var fs=require("fs");
var readline=require('readline');
//First login into spotify

//Get your user id from https://www.spotify.com/in/account/overview/
var user_id="slyxn5y9wp8rop2wod5bjekhb";

//Get OAuth token form "https://developer.spotify.com/console/get-current-user-playlists/" and press get Token select playlist-read-private
var token = "BQC2GedFP_zwuClRwOLl-ZQ-kEtY-GGnp91Y-64dsIlOjzJ5ZvlnDfzFOx6us0jDdPWuYE29_Z6elXT34d5CZxcm22jNhrI3VvmtFZyHZNmCKx0f2T4on1bmItvFYIdZaQSNaBC9vSIipE6j011jNZ9LRT5SZ66IZCXPG_y-F8UWSauY-pkh8etH3A"

//Location of the file
const fileLoc="./YoutubeLinks.txt"
var writeStream = fs.createWriteStream(fileLoc,{flags:"a"});

//Youtube Search
const yts = require( 'yt-search' );

var playlists_url="https://api.spotify.com/v1/users/"+user_id+"/playlists?limit=50";

request({url:playlists_url, headers:{"Authorization":"Bearer "+token}}, function(err, res){
	if (res){
        var playlists=JSON.parse(res.body);	
        if("error" in playlists){console.log(playlists.error);process.exit()}
        else if("undefined"===typeof(playlists.items[0])){
          console.log("Users has the no playlists.\nTry Using getLikedMusic.js.")
        }
        else{
          var indexes=Object.keys(playlists.items)
          runLoop = async()=>{
            for( const no of indexes){
              console.log("PlayList name:"+playlists.items[no].name)

              var ans= await getResponse();
              var playlist_url = playlists.items[no].href;
              search(playlist_url,ans);
            }
          }             
      }runLoop();
}}
)

async function search(playlist_url,ans){
  if(ans=='no'){
request({url:playlist_url, headers:{"Authorization":"Bearer "+token}}, function(err, res){
			if (res){
				var playlist = JSON.parse(res.body);
				playlist.tracks.items.some(function(track){
            if(null!=track.track){
                    yts( track.track.name, function ( err, r ) {
                      if(err){
                        if(err.code=="ECONNRESET"){console.log("\nToo many YouTube Search Requests.\nO_o\nThat should be enough. Closing the search.")
                          process.exit()}
                        return console.error(err);
                      } 
                      const videos = r.videos;
                      writeStream.write("!play " +videos[0].url+"\r\n")
                    } )
        }});
			}
    })
  }
}
async function getResponse(){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(userAns=>{
    rl.question("Do you want to skip this Playlist??\nAnswer with yes\\no:",user=>{
      
      console.log(`\n`)
      rl.close();
      userAns(user);
    })
  });
}

