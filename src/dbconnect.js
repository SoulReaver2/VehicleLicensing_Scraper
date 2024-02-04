//@ts-check
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "";

const connect = () => {
  return mongoose.connect(uri, {
    dbName: process.env.DB_NAME
  });
};

module.exports = { connect };
