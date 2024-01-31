function loader() {
  return new Map();
}

function checkIfexists(map, url) {
  return map.has(url);
}

function insert(url, scrapedStatus, map) {
  if (!map.has(url)) {
    map.set(url, scrapedStatus);
  }
}

function extractIdFromUrl(url) {
  const numberMatch = url.match(/\/(\d+)/);
  return numberMatch ? parseInt(numberMatch[1], 10) : null;
}

module.exports = {
  loader,
  checkIfexists,
  insert,
  extractIdFromUrl
};
