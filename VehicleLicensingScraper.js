const LibSeed = require("./src/seedRepository");

const urls = LibSeed.readFromSeed();
console.log("Read strings from eeprom.txt:", urls);
