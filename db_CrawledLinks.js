//@ts-check
const mongoose = require("mongoose");
const { connect } = require("./src/dbconnect");

const crawledLinkSchema = new mongoose.Schema({
  link: String,
  status: Boolean,
  crawled_date: Date
});

const CrawledLinkModel = mongoose.model("crawledLink", crawledLinkSchema);

connect()
  .then(async () => {
    console.log("Successfully connected to MongoDB");

    const doc = await CrawledLinkModel.create({});
    console.log(`New listing created with the following id: ${doc._id}`);

    const all = await CrawledLinkModel.find({});
    console.log(all);

    await mongoose.connection.close();
    console.log("Connection closed");
  })
  .catch((e) => {
    console.log(e.message);
  });

function fromArrayOfObjectsToMap(array) {
  const map = new Map();
  array.forEach((obj) => {
    map.set(obj.link, obj.status);
  });
  return map;
}
