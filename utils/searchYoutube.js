// const ytSearch = require('yt-search');

// const searchYoutube = async (query) => {
//   const result = await ytSearch(query);
//   return result.videos.length > 0 ? result.videos[0] : null;
// };

// module.exports = { searchYoutube };

const ytSearch = require('yt-search');
const ytpl = require('ytpl');
const addPlaylist = require('./addPlaylist');

const searchYoutube = async (query, message) => {
  try {
    // Check if the query is a valid playlist URL
    if (ytpl.validateID(query)) {
      await addPlaylist(message, query); // Call addPlaylist with the playlist URL
      return null; // Return null since the playlist is being handled by addPlaylist
    }

    // Perform a video search if not a playlist
    const result = await ytSearch(query);
    return result.videos.length > 0 ? result.videos[0] : null;
  } catch (error) {
    console.error(`Error in searchYoutube: ${error.message}`);
    throw error;
  }
};

module.exports = { searchYoutube };