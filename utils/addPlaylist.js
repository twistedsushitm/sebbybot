const ytpl = require('ytpl');
const { addSongToQueue } = require('../player/queueManager');

module.exports = async (message, playlistUrl) => {
  try {
    if (!ytpl.validateID(playlistUrl)) {
      return message.reply("Invalid playlist URL.");
    }

    const playlist = await ytpl(playlistUrl);
    playlist.items.forEach((video) => addSongToQueue(video.url));
    message.reply(`Added **${playlist.items.length}** songs to the queue.`);
  } catch (error) {
    console.error(`Playlist Error: ${error.message}`);
    message.reply("Failed to retrieve the playlist.");
  }
};