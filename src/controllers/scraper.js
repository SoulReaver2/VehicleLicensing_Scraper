const Link = require("./models/link");
const Scrape = require("./models/scrape");
const Crawler = require("./services/crawler");
const Parser = require("./services/parser");
const Logger = require("./utils/logger");
const Seed = require("./utils/seed");
const config = require("./config");
const fs = require("fs");
const path = require("path");

class Scraper {
  constructor() {
    this.logger = new Logger();
    this.seedReader = new Seed(config.seedFile);
    this.urlsToProcess = this.seedReader.readSeeds();
    this.crawler = new Crawler(this.logger);
    this.parser = new Parser();
    this.visitedLinks = new Map();
    this.scrapes = [];
  }

  async start() {
    while (this.urlsToProcess.length > 0) {
      const url = this.urlsToProcess.pop();
      await this.crawlLink(url, 0);
    }

    this.writeScrapes();
  }

  async crawlLink(url, depth) {
    if (!this.isValidLink(url)) {
      // Write "urlstoprocess" into the seed file to exclude the invalid url from the seed
      this.seedReader.writeSeeds(this.urlsToProcess);
      return;
    }

    const { relatedLinks, data } = await this.crawler.crawl(url, depth);

    /*
    const parsedData = this.parser.parse(data);
    this.scrapes.push(new Scrape(url, parsedData, depth));
    */

    if (Object.keys(data).length === 0) {
      this.visitedLinks.set(url, 404);
      this.logger.info(`No data to scrape from: ${url}`);
    } else {
      this.logger.info(`Successfully scraped data from : ${url}`);
      relatedLinks.forEach((url) => {
        if (this.urlsToProcess.indexOf(url) === -1) {
          this.urlsToProcess.unshift(url);
        }
      });
      this.seedReader.writeSeeds(this.urlsToProcess);
      // LibDb.save(vehicleLidenseData) in the database
      this.visitedLinks.set(url, 200);
    }
  }

  isValidLink(url) {
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

// how do you implement a last in first out LIFO data structure in javascript

module.exports = Scraper;
