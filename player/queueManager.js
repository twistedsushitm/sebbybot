let queue = [];

const addSongToQueue = (url) => queue.push(url);
const getNextSong = () => queue.shift();
const getQueue = () => queue;

module.exports = { addSongToQueue, getNextSong, getQueue };