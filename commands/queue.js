const { getQueue } = require('../player/queueManager');
const ytdl = require("ytdl-core")


module.exports = (message) => {
  const queue = getQueue();

  if (queue.length === 0) {
    return message.reply("The queue is currently empty.");
  }

  let queueMessage = "**Current Queue:**\n";
  queue.forEach((song, index) => {
    queueMessage += `${index + 1}. ${song}\n`;
  });

  message.channel.send(queueMessage);
};