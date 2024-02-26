const mongoose = require("mongoose");

class MongoClient {
  constructor() {
    this.mongoose = mongoose;
    this.connection = null;
  }

  connect(uri) {
    return new Promise((resolve, reject) => {
      this.mongoose
        .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
          console.log("MongoDB connected");
          this.connection = this.mongoose.connection;
          resolve();
        })
        .catch((err) => {
          console.error("MongoDB connection error:", err);
          reject(err);
        });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (!this.connection) {
        return reject(new Error("Not connected to MongoDB"));
      }
      this.connection
        .close()
        .then(() => {
          console.log("MongoDB disconnected");
          resolve();
        })
        .catch((err) => {
          console.error("MongoDB disconnection error:", err);
          reject(err);
        });
    });
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = MongoClient;
