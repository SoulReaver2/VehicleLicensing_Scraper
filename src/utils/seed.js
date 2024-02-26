const fs = require("fs");

class Seed {
  constructor(seedFile) {
    this.seedFile = seedFile;
  }

  writeSeeds(strings) {
    try {
      fs.unlinkSync(this.seedFile);
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
    const fileStream = fs.createWriteStream(this.seedFile);
    strings.forEach((str) => fileStream.write(`${str}\n`));
    fileStream.end();
    fileStream.on("finish", () => {
      console.log("Wrote strings to seed file");
    });
  }

  readSeeds() {
    try {
      const fileData = fs.readFileSync(this.seedFile, "utf8");
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
}
module.exports = Seed;
