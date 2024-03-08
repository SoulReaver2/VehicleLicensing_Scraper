const mongoose = require("mongoose");

const scrapeSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  status: { type: Number, default: 200 },
  crawled_date: { type: Date, default: Date.now }
});

const Scrape = mongoose.model("scrape", scrapeSchema);

class ScrapesService {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;
  }

  async addScrape(link) {
    try {
      await this.mongoClient.connect();
      const result = await Scrape.create(link);
      return result;
    } catch (error) {
      console.error("Error adding scraped data:", error);
      throw error;
    }
  }

  async getAllScrapes() {
    try {
      await this.mongoClient.connect();
      const result = await Scrape.find({});
      return result;
    } catch (error) {
      console.error("Error getting all scraped data:", error);
      throw error;
    }
  }
}

module.exports = ScrapesService;
