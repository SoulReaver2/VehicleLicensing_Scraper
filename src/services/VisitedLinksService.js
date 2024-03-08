const mongoose = require("mongoose");

const visitedLinkSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  status: { type: Number, default: 200 },
  crawled_date: { type: Date, default: Date.now }
});

const VisitedLink = mongoose.model("visitedLink", visitedLinkSchema);

class VisitedLinksService {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;
  }

  async addVisitedLink(link) {
    try {
      await this.mongoClient.connect();
      const result = await VisitedLink.create(link);
      return result;
    } catch (error) {
      console.error("Error adding visited link:", error);
      throw error;
    }
  }

  async getAllVisitedLinks() {
    try {
      await this.mongoClient.connect();
      const result = await VisitedLink.find({});
      return result;
    } catch (error) {
      console.error("Error getting all visited links:", error);
      throw error;
    }
  }
}

module.exports = VisitedLinksService;
