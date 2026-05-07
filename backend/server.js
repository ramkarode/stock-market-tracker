const http = require("http");
const dotenv = require("dotenv");

const app = require("./app");
const connectDB = require("./config/database");
// const startCronJobs = require("./jobs/indicatorAlertjob"); //will test this later
// const { initSocket } = require("./sockets/socket");
const gracefulShutdown = require("./utils/gracefulShutdown");

dotenv.config();

const startServer = async () => {
  try {
    // DB connect
    await connectDB();

    const server = http.createServer(app);

    // initSocket(server);
    // startCronJobs(); 

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });

    // Graceful shutdown (simple)
    gracefulShutdown();
  } catch (error) {
    console.error(" Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
