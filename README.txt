Dependencies
npm install discord.js @discordjs/opus ytdl-core --save
npm install request
npm install yt-search

Install ffmpeg.
https://www.wikihow.com/Install-FFmpeg-on-Windows

Or 
npm install ffmpeg-static

<Bot works perfectly. The possibility of crashing is low. But it may...>
First Run getPlaylist.js or getLikedMusic.js. For getting YouTube Links from the user's Spotify Account.
----------------------------

config.json
Configuration for bot. 
First create a bot in Discord. Need help in creating bot, Check this link https://gabrieltanner.org/blog/dicord-music-bot
""Parameters""
Prefix: It is for the bot to understand that it's his commands
Token: You need to create the bot then copy it's token. 


bot.js
It's the bot script. No changes are required.

getLikedMusic.js
It's the script to get the user's liked musics.
""Parameters""
user_id: Spotify User ID.
token: Spotify OAuth token.

getPlaylist.js
It's the script to get the spotify playlist and will run the google search to get the youtube links and then store it.
""Parameters""
user_id: Spotify User ID.
token: Spotify OAuth token.
Reference for this code: API University

