function pause(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const delay = async (milliseconds) => {
  await pause(milliseconds); // minute * seconds * miliseconds
};

module.exports = { delay };