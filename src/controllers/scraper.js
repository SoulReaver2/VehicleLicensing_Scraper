const Link = require("./models/link");
const Scrape = require("./models/scrape");
const Crawler = require("./services/crawler");
const Parser = require("./services/parser");
const Logger = require("./utils/logger");
const config = require("./config");
const fs = require("fs");
const path = require("path");

class Scraper {
  constructor() {
    this.logger = new Logger();
    this.crawler = new Crawler(this.logger);
    this.parser = new Parser();
    this.visitedLinks = new Set();
    this.scrapes = [];
  }

  async start() {
    const seedLinks = await this.readSeeds();

    for (const link of seedLinks) {
      await this.crawlLink(link, 0);
    }

    this.writeScrapes();
  }

  async readSeeds() {
    const seedFile = path.join(__dirname, "..", "seed.txt");
    const seedLinks = await fs.promises
      .readFile(seedFile, "utf-8")
      .then((data) => data.trim().split("\n"))
      .catch((error) => {
        this.logger.error(`Error reading seed file: ${error.message}`);
        process.exit(1);
      });

    return seedLinks.filter((link) => link.trim() !== "");
  }

  async crawlLink(url, depth) {
    if (!this.isValidLink(url, depth)) {
      return;
    }

    this.visitedLinks.add(url);

    const { links, data } = await this.crawler.crawl(url, depth);

    const parsedData = this.parser.parse(data);

    this.scrapes.push(new Scrape(url, parsedData, depth));

    for (const link of links) {
      await this.crawlLink(link, depth + 1);
    }
  }

  isValidLink(url, depth) {
    const baseUrl = new URL(config.baseUrl);
    const linkUrl = new URL(url, baseUrl);

    if (linkUrl.origin !== baseUrl.origin) {
      this.logger.info(`Ignoring external link: ${url}`);
      return false;
    }

    if (this.visitedLinks.has(url)) {
      this.logger.info(`Ignoring previously visited link: ${url}`);
      return false;
    }

    if (depth >= config.maxDepth) {
      this.logger.info(`Ignoring link beyond maximum depth: ${url}`);
      return false;
    }

    return true;
  }

  writeScrapes() {
    const outputFile = path.join(__dirname, "..", "data", "scrapes.json");

    fs.promises
      .writeFile(outputFile, JSON.stringify(this.scrapes, null, 2))
      .then(() => {
        this.logger.info("Scrapes written to file");
      })
      .catch((error) => {
        this.logger.error(`Error writing scrapes to file: ${error.message}`);
        process.exit(1);
      });
  }
}

module.exports = Scraper;
