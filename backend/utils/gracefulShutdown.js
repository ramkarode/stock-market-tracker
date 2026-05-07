const mongoose = require("mongoose");

const gracefulShutdown = () => {
  const shutdown = async (signal) => {
    console.log(`\n Received ${signal}. Closing DB...`);
    try {
      await mongoose.connection.close(false);
      console.log(" MongoDB connection closed");
      process.exit(0);
    } catch (err) {
      console.error(" Error during shutdown:", err);
      process.exit(1);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

module.exports = gracefulShutdown;
