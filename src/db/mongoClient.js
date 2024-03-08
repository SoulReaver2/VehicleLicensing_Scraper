const mongoose = require("mongoose");
require("dotenv").config();

class MongoClient {
  constructor() {
    this.mongoUri = process.env.MONGODB_URI;
    this.dbName = process.env.DB_NAME;
    this.connection = null;
  }

  async connect() {
    if (this.connection) {
      console.log("Already connected to MongoDB");
      return;
    }
    try {
      await mongoose.connect(this.mongoUri, { dbName: this.dbName });
      this.connection = mongoose.connection;
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      throw err;
    }
  }

  async close() {
    if (!this.connection) {
      throw new Error("Not connected to MongoDB");
    }
    try {
      await this.connection.close();
      console.log("MongoDB disconnected");
    } catch (err) {
      console.error("MongoDB disconnection error:", err);
      throw err;
    }
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = MongoClient;
