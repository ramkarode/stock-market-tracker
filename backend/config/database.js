// config/db.js
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async (retries = 5, delay = 5000) => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return mongoose.connection;
  }

  try {
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern defaults (2026)
      maxPoolSize: 10, // control pool size
      serverSelectionTimeoutMS: 5000, // fail fast if DB not reachable
      socketTimeoutMS: 45000, // close idle sockets
    });

    isConnected = true;

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Connection events
    mongoose.connection.on("connected", () => {
      console.log("📡 Mongoose connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose disconnected");
      isConnected = false;
    });

    return conn.connection;
  } catch (error) {
    console.error(`DB connection failed: ${error.message}`);

    if (retries > 0) {
      console.log(`Retrying in ${delay / 1000}s... (${retries} attempts left)`);
      await new Promise((res) => setTimeout(res, delay));
      return connectDB(retries - 1, delay);
    }

    console.error("Max retries reached. Exiting...");
    process.exit(1);
  }
};

module.exports = connectDB;
