//@ts-check

const LibSeed = require("./src/seedRepository");
const LibCrawl = require("./src/crawlFrontier");

const urlsToScrap = LibSeed.readFromSeed();
console.log("Urls to scrap:", urlsToScrap);

const Cache = LibCrawl.loader();
console.log("Crawl frontier:", Cache);

const url = urlsToScrap.pop();
if (LibCrawl.checkIfexists(Cache, url)) {
  console.log("This url is Already crawled:", url);
  LibSeed.writeToSeed(urlsToScrap);
  // retourne au pop du tableau
} else {
  console.log("Crawling:", url);
  const results = crawlAndScrap(url);
  LibCrawl.insert(url, results.scrapedStatus, Cache);
  if (results.scrapedStatus) {
    console.log("Scraped:", url);
    // first we should test if the related urls exist in the urlsToScrap array before inserting
    urlsToScrap.unshift(...results.scrapedData.relatedUrls);
    LibSeed.writeToSeed(urlsToScrap);
    // save the vehicleLidenseData in the database
  }
}

console.log("these are the scraped urls: ", Cache);

function crawlAndScrap(url) {
  const baseurl =
    "https://www.vehicle-operator-licensing.service.gov.uk/view-details/licence/";
  const numberOfRelatedUrls = getRandomInt(0, 10);
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
