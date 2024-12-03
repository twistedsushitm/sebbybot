const { player } = require('../player/audioPlayer');
const { getQueue } = require('../player/queueManager');
const ytdl = require("ytdl-core")


module.exports = (message) => {
  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.reply("You need to be in a voice channel to skip the song!");
  }

  if (getQueue().length === 0) {
    return message.reply("The queue is empty, there's nothing to skip.");
  }

  message.reply("Skipping the current song...");
  player.stop(); // Stops the current song, triggering the next one to play
};