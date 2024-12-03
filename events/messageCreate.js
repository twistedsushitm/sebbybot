const play = require('../commands/play');
const skip = require('../commands/skip');
const stop = require('../commands/stop');
const addPlaylist = require('../utils/addPlaylist');
const queueCommand = require('../commands/queue');
const ytdl = require("ytdl-core")

const PREFIX = '!';

module.exports = async (client, message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'play':
      play(message, args);
      break;
    case 'skip':
      skip(message);
      break;
    case 'stop':
      stop(message);
      break;
    case 'playlist':
      addPlaylist(message, args[0]);
      break;
    case 'queue':
      queueCommand(message);
      break;
    default:
      message.reply("Unknown command. Try `!play`, `!stop`, `!skip`, or `!playlist`.");
  }
};