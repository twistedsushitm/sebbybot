const { player } = require('../player/audioPlayer');
const ytdl = require("ytdl-core")
const { Client, GatewayIntentBits } = require ('discord.js')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, generateDependencyReport } = require('@discordjs/voice')


module.exports = (message) => {
  const voiceChannel = message.member.voice.channel;
  
  if (!voiceChannel) {
    return message.reply("You need to be in a voice channel to stop the music!");
  }

  if (!message.guild.members.me.voice.channel) {
    return message.reply("I'm not in a voice channel.");
  }

  player.stop(); // Stops the current playback
  message.reply("Music stopped and I'm leaving the voice channel.");
};