Dependencies
npm install discord.js @discordjs/opus ytdl-core --save
npm install request
npm install yt-search

Install ffmpeg.
https://www.wikihow.com/Install-FFmpeg-on-Windows

Or 
npm install ffmpeg-static

<Bot may Sometimes crash. The possibility is low. But it may... And bot definately crashes when you entered wrong url>
First Run getPlaylist.js, then bot.js. For awailing all functionality.
----------------------------

config.json
Configuration for bot. 
Prefix: It is for the bot to understand that it's his commands
Token: You need to create the bot then copy it's token. 
Need help in creating bot. Check this link https://gabrieltanner.org/blog/dicord-music-bot


bot.js
It's the bot script. No changes are required.

getPlaylist.js
It's the script to get the spotify playlist and will run the google search to get the youtube links and then store it.
user_id: your spotify account userID.
token: Spotify OAuth token.
Reference for the code: API University

