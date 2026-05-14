const express = require("express");
const morgan = require("morgan");
const logger = require("./config/logger");
const cookieParser = require("cookie-parser");
const errorHandler = require("./utils/errorHandler");
const { SuccessResponse } = require("./utils/responseHandlers");
const AuthRouter = require("./routes/auth.routes");
const StockRouter = require("./routes/stock.routes");
const watchlistRoutes = require("./routes/watchlist.routes");
const HoldingRouter = require("./routes/holding.routes");
const authMiddleware = require("./middlewares/auth.middleware");
const AlertRouter = require("./routes/alert.routes");
const { alertTriggerFn } = require("./jobs/indicatorAlertjob");
const cors = require("cors");
const { emitToUser } = require("./sockets/socket");
const app = express();

const stream = {
  write: (message) => logger.info(message.trim()),
};

// Middlewares
app.use(express.json());
app.use(morgan("dev", { stream }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://stock-market-tracker-nine.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
); // setup this later
// Routes
app.get("/", (req, res) => {
  res.send("server is live");
});
app.use("/auth", AuthRouter);
app.use("/stocks", StockRouter);
app.use("/watchlist", watchlistRoutes);
app.use("/portfolio", HoldingRouter);
app.use("/alert", AlertRouter);
// app.get("/test/trigger",alertTriggerFn) //alert trigger test api
app.get("/alert-emmit", (req, res) => {
  let userId = req.query.userId;
  emitToUser(userId, "alertTriggered", { data: [], mess: "Alert triggered!" }); // Replace with actual user ID
  res.send("emmiting alert event");
});
app.get("/health-check", (req, res) => {
  new SuccessResponse(res, "server is fine", [], 200, true);
});

app.use(errorHandler);
module.exports = app;
