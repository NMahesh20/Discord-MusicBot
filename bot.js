const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");
var fs = require('fs');
var readline = require('readline');
const client = new Discord.Client();

//File location
let file="./YoutubeLinks.txt";  

//To store the songs
const queue = new Map();


var channelID;
var tempVoiceChannel;
var voiceChannelID;
//On ready add bot to Voice Channel and Send intro message
client.once("ready", () => {
  console.log("Ready!");
    let allChannels=Object.values(client.channels)[1];
for (let c of allChannels) {
    let channelType = c[1].type;
    if (channelType === "text") {
        channelID = c[0];
        console.log("Channel id:"+channelID);
        client.channels.cache.get(channelID).send(`XLR8 Here, Ready for Execution.\nLet's Rock and Roll.🤘\nType '${prefix}help' to know commands.\nJoin The voice channel, if not done.`)
    }
    if(channelType=="voice"){
      voiceChannelID=c[0];
      tempVoiceChannel=client.channels.cache.get(c[0]);
      if(!tempVoiceChannel) return console.error("The channel does not exist!");
      tempVoiceChannel.join().then(connection => {
        console.log("Successfully Joined Voice Channel.");
    }).catch(e => {

        console.error(e);
    });
    }
}

});
client.on("message", async message => {
  

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else if(message.content.startsWith(`${prefix}help`)){
      message.channel.send(`Commands defined:\n${prefix}play <YouTube Link> -> To Play the music\n${prefix}skip -> To skip the currently playing song\n${prefix}stop -> To stop the bot.\n${prefix}readLinks -> For reading File which contain ${prefix} <YouTube links>.\n${prefix}enterVoiceChannel -> To join the Voice Channel`)
  }else if(message.content.startsWith(`${prefix}readLinks`)){
    message.channel.send("Wait till All the Links are added.⏳\nYour Patience will be as worth as your Playlist.")

      readLinks(message,serverQueue);
  }else if(message.content.startsWith(`${prefix}enterVoiceChannel`)){
      enterVoiceChannel();
  }
  else if(message.content.startsWith(`${prefix}`)){
    message.channel.send(`Oops!!\nIt seems my developer has not defined that yet for me.\n(＞﹏＜)\nType ${prefix}help to list the available commands.`)

  }

  
});
async function enterVoiceChannel(){
  tempVoiceChannel=client.channels.cache.get(voiceChannelID);
      if(!tempVoiceChannel) {console.error("The channel does not exist!"); return false;}
  tempVoiceChannel.join().then(connection => {
}).catch(e => {

    console.error(e);
});
}
async function readLinks(message,serverQueue){
  let proceed=false;
  await enterVoiceChannel(); proceed=true;
  if(proceed){
  fs.stat(file, function(err,stat){
    if(err){
      message.channel.send("Woops!!.\nUnable to locate the File. Place the file in Bot's directory, name of File is: '"+file+"'.\nAnd Run the command again");
      console.log("File unable to locate error."); 
    }
    else {

        var rd = readline.createInterface({
            input: fs.createReadStream(file),
            console: false
        });
        rd.on('line', function(line) {
          if(line[0]===`${prefix}`){
          message.channel.send(line);}
          else{
            message.channel.send(`${prefix}play `+line);
          }
        }); 

    }
 });
}
}
async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(`${prefix}enterVoiceChannel`);
    
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }
if(args.length==2){
  const songInfo = await ytdl.getInfo(args[1]);
  
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }}
  else { return message.channel.send("Please mention the link.");}
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(`${prefix}enterVoiceChannel`);
  if (!serverQueue)
    return message.channel.send("No songs in the List to skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if(queue.size==0){return message.channel.send("No song to Stop. Try Playing some, It would be relaxing.")}
  else{
  if (!message.member.voice.channel)
    return message.channel.send("You have to be in a voice channel to stop the music!" );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
  return message.channel.send("Time to Say GoodBye.\nXLR8 signing out.\nX﹏X");
}
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  options={
    quality:'highestaudio'
  };
  const dispatcher = serverQueue.connection
    .play(ytdl(song.url,options))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

client.login(token);