const fs = require("fs");

const SEED_PATH = "./seed/urls.txt";

function writeToSeed(strings) {
  try {
    fs.unlinkSync(SEED_PATH);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(
        "Error deleting previous contents of seed file:",
        err.message
      );
      process.exit(1);
    }
  }

  // Write the strings to the file, one by line
  const fileStream = fs.createWriteStream(SEED_PATH);
  strings.forEach((str) => fileStream.write(`${str}\n`));
  fileStream.end();
  fileStream.on("finish", () => {
    console.log("Wrote strings to seed file");
  });
}

function readFromSeed() {
  try {
    const fileData = fs.readFileSync(SEED_PATH, "utf8");
    return fileData.split("\n").filter((str) => str.length > 0);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("File doesn't exists");
      process.exit(1);
    } else {
      console.error("Error reading seed file:", err.message);
      process.exit(1);
    }
  }
}

module.exports = { writeToSeed, readFromSeed };
