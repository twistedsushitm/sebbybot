const { Client, GatewayIntentBits } = require ('discord.js')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, generateDependencyReport } = require('@discordjs/voice')
const ytdl = require('@distube/ytdl-core')
const ytSearch = require('yt-search');
const ytpl = require('ytpl');
require ('dotenv').config();

console.log(generateDependencyReport());

// Bot Token
const TOKEN = process.env.TOKEN;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Command prefix
const PREFIX = "!";
let queue = [];
let player = createAudioPlayer();

client.once('ready', ()=> {
  console.log(`${client.user.tag} is online and ready!`);
});

// Function that adds delay

// Function that plays music duh
async function playMusic(message) {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    return message.reply("You need to be in a voice channel to play music!");
  } try {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    
    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log('The bot has connected to the voice channel');
    });
    

    const playNext = async () => {
      if (queue.length === 0){
        let delayres = await delay(300000); // 5 mins
        connection.destroy();
        message.channel.send("Queue is empty... my job here is done. Goodbye")
        return;
      }

      const nextUrl = queue.shift();
      const stream = ytdl(nextUrl, { filter: 'audioonly', highWaterMark: 1 << 25, }); // Prevents buffering issues... or so i told. 
      const resource = createAudioResource(stream);
      
      player.play(resource);
      connection.subscribe(player);

      player.once(AudioPlayerStatus.Idle, playNext);
      player.on('error', (error) => {
        console.error(`Player Error: ${error.message}`);
        message.channel.send("An error occured during playback")
        playNext();
      });
    };
    
    // Is for the first song
    if(player.state.status !== AudioPlayerStatus.Playing){
      playNext();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    message.channel.send("Failed to join the voice channel or play the song.");
  }
}

// Function to seaerch yt videos
async function searchYoutube(query){
  const result = await ytSearch(query);
  return result.videos.length > 0 ? result.videos[0] : null;
}

// Function to add playlist
async function addPlaylistToQueue(message, playlistUrl){
  try {
    if (!ytpl.validateID(playlistUrl)) {
      throw new Error("Invalid playlist URL");
    }

    const playlist = await ytpl(playlistUrl);
    playlist.items.forEach((video) => {
      queue.push(video.url);
    });
    message.channel.send(`Added **${playlist.items.length}** songs from the playlist to the queue.`);
  } catch (error) {
    console.error(`Playlist Error: ${error.message}`);
    message.channel.send("Failed to retrieve playlist. Please check the URL.");
  }
}

// Listen for messages
client.on ('messageCreate', async (message) => {
  
  // Ignoring messages without the prefix
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  // play <YT url or keywords>
  if (command === 'play') {
    const searchQuery = args.join(' ');

    if(!searchQuery) return message.reply("Please provide a song name or Youtube URL");

    if (ytpl.validateID(searchQuery)){
      // Here's where the code handles the YT Playlist URL
      message.reply("Detected a playlist. Adding songs to queue...");
      await addPlaylistToQueue(message, searchQuery);
    } else if (ytdl.validateURL(searchQuery)){
      queue.push(searchQuery);
      message.reply(`Added to queue: ${searchQuery}. Queue position: ${queue.length}`);
    } else {
      // Here where the code handles video URL or a keyword
      const video = await searchYoutube(searchQuery);
      if (video) {
        queue.push(video.url);
        message.reply(`Now Playing: **${video.title}** (${video.url})`);
      } else {
        return message.reply("No results found for your search.");
      }
    }

    // Start playing if not already playing
    if (player.state.status !== AudioPlayerStatus.Playing) {
      await playMusic(message);
    }
  }

  // stop
  if (command === 'stop'){
    const voiceChannel = message.member.voice.channel;
    if(voiceChannel && message.guild.members.me.voice.channel) {
      queue = [];
      player.stop();
      message.reply("I stopped and I'm leaving, bye!");
    } else {
      message.reply("I'm not in a voice channel, you tweaking.");
    }
  }

  // skip
  if (command === 'skip'){
    if (queue.length === 0){
      message.reply("The queue is empty, there's nothing to skip.");
    } else {
      message.reply("Skipping the current song...");
      player.stop(); // Stops the current song, triggering the next one
    }
  }
});



// To prevent crashes from unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection: ', error);
});

client.login(TOKEN);