const axios = require("axios");
const cheerio = require("cheerio");

class Crawler {
  constructor(logger) {
    this.logger = logger;
  }

  async crawl(url, depth) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // ... extract links and data from the page

    return {
      links: links,
      data: data
    };
  }
}

module.exports = Crawler;
