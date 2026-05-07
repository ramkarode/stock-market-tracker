const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/database");
const mongoose = require("mongoose");

dotenv.config();

const startServer = async () => {
  try {
    // DB connect
    await connectDB();

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });

    // Graceful shutdown (simple)
    process.on("SIGINT", async () => {
      console.log("Shutting down...");

      await mongoose.connection.close();
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(" Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
