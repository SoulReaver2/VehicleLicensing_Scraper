//@ts-check

const LibSeed = require("./src/seedRepository");
const LibCrawl = require("./src/crawlFrontier");

const urlsToScrap = LibSeed.readFromSeed();
console.log("Urls to scrap:", urlsToScrap);

const Cache = LibCrawl.loader();
console.log("Crawl frontier:", Cache);

while (urlsToScrap.length > 0) {
  const url = urlsToScrap.pop();
  if (LibCrawl.checkIfexists(Cache, url)) {
    console.log("This url is Already crawled:", url);
    LibSeed.writeToSeed(urlsToScrap);
    continue;
  } else {
    console.log("Crawling:", url);
    const results = crawlAndScrap(url);
    LibCrawl.insert(url, results.scrapedStatus, Cache);
    if (results.scrapedStatus) {
      console.log("Successfully scraped data from:", url);
      // urlsToScrap.unshift(...results.scrapedData.relatedUrls);
      let relatedUrls = results.scrapedData.relatedUrls;
      relatedUrls.forEach((url) => {
        if (urlsToScrap.indexOf(url) === -1) {
          urlsToScrap.unshift(url);
        }
      });
      LibSeed.writeToSeed(urlsToScrap);
      // LibDb.save(vehicleLidenseData) in the database
    } else {
      console.log("No data to scrape from:", url);
    }
  }
}
console.log("these are the scraped urls: ", Cache);

function crawlAndScrap(url) {
  const baseurl =
    "https://www.vehicle-operator-licensing.service.gov.uk/view-details/licence/";
  const numberOfRelatedUrls = getRandomInt(0, 2);
  let relatedUrls = [];
  for (let i = 0; i < numberOfRelatedUrls; i++) {
    relatedUrls.push(`${baseurl}${getRandomInt(100, 10000)}`);
  }
  return {
    id: LibCrawl.extractIdFromUrl(url),
    scrapedStatus: true,
    scrapedData: {
      relatedUrls: relatedUrls
    }
  };
}

// function to generate a random integer between a given min and max
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
