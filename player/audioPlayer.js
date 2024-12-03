const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { getNextSong } = require('./queueManager');
const player = createAudioPlayer();
const ytdl = require("@distube/ytdl-core")
const { delay } = require("../utils/delay")

let leaveTimeout = null;


const playNext = async (connection, message) => {
  const nextUrl = getNextSong();
  if (!nextUrl) {
    message.channel.send("Queue is empty.");
    return;
  }
  if (queue.length === 0) {
    // Queue is empty, start a timeout to leave the channel
    if (!leaveTimeout) {
      leaveTimeout = setTimeout(() => {
        connection.destroy(); // Leave the channel
        message.channel.send("Leaving the voice channel.");
        leaveTimeout = null; // Reset the timeout
      }, 5 * 60 * 1000); // 5 minutes in milliseconds
    }
    return;
  }

  // If there's music in the queue, cancel any existing timeout
  if (leaveTimeout) {
    clearTimeout(leaveTimeout);
    leaveTimeout = null;
  }

  try {
    const stream = ytdl(nextUrl, { filter: 'audioonly', highWaterMark: 1 << 25 });
    const resource = createAudioResource(stream);
    player.play(resource);
    connection.subscribe(player);

    player.once(AudioPlayerStatus.Idle, () => playNext(connection, message));
  } catch (error) {
    console.error(`Player Error: ${error.message}`);
    message.channel.send("An error occurred during playback.");
    playNext(connection, message);
  }
};

module.exports = { player, playNext };