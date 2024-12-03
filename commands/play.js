const { joinVoiceChannel } = require('@discordjs/voice');
const { searchYoutube } = require('../utils/searchYoutube');
const { addSongToQueue } = require('../player/queueManager');
const { player, playNext } = require('../player/audioPlayer');
const ytdl = require("ytdl-core")

module.exports = async (message, args) => {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    return message.reply("You need to be in a voice channel to play music!");
  }

  const searchQuery = args.join(' ');
  if (!searchQuery) {
    return message.reply("Please provide a song name or a valid YouTube URL.");
  }

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  const video = await searchYoutube(searchQuery);
  if (video) {
    addSongToQueue(video.url);
    message.reply(`Added to queue: **${video.title}**`);
    if (player.state.status !== 'playing') {
      playNext(connection, message);
    }
  } else {
    message.reply("No results found for your search.");
  }
};