const cron = require("node-cron");

const Alert = require("../models/alert.model");

const { getBulkQuotes } = require("../services/stock.service");

const { getIO } = require("../sockets/socket");

const logger = require("../config/logger");

let isStarted = false;

const startCronJobs = () => {
  if (isStarted) return;

  isStarted = true;

  logger.info("Cron Jobs Started");

  // ================================
  // ALERT CHECKER JOB
  // ================================

  cron.schedule("*/30 * * * * *", async () => {
    try {
      logger.info("Running alert checker cron");

      // STEP 1 → fetch all pending alerts
      const pendingAlerts = await Alert.find({
        isTriggered: false,
      });
      console.log(pendingAlerts);

      if (!pendingAlerts.length) {
        logger.info("No pending alerts found");
        return;
      }

      // STEP 2 → extract unique symbols
      const symbols = [...new Set(pendingAlerts.map((alert) => alert.symbol))];

      // console.log("symbols", symbols);

      logger.info(`Fetching stock prices for: ${symbols.join(", ")}`);

      // STEP 3 → fetch latest stock prices
      // Expected format:
      // {
      //   AAPL: 260,
      //   TSLA: 180
      // }

      const stockPrices = await getBulkQuotes(symbols);
      console.log("stock price",stockPrices)

      const io = getIO();

      // STEP 4 → check alert conditions
      for (const alert of pendingAlerts) {
        const currentPrice = stockPrices[alert.symbol];

        // Skip if stock price unavailable
        if (currentPrice === undefined || currentPrice === null) {
          logger.warn(`Price not found for symbol: ${alert.symbol}`);

          continue;
        }

        let shouldTrigger = false;

        // GREATER THAN
        if (alert.conditionType === "gt" && currentPrice > alert.targetPrice) {
          shouldTrigger = true;
        }

        // LESS THAN
        if (alert.conditionType === "lt" && currentPrice < alert.targetPrice) {
          shouldTrigger = true;
        }

        // STEP 5 → trigger alert
        if (shouldTrigger) {
          alert.isTriggered = true;

          alert.triggeredAt = new Date();

          await alert.save();

          logger.info(
            `Alert triggered | User: ${alert.userId} | Symbol: ${alert.symbol}`,
          );

          // STEP 6 → emit realtime socket event
          io.to(alert.userId.toString()).emit("alert-triggered", {
            type: "PRICE_ALERT",

            message:
              alert.conditionType === "gt"
                ? `${alert.symbol} crossed above ${alert.targetPrice}`
                : `${alert.symbol} dropped below ${alert.targetPrice}`,

            data: {
              alertId: alert._id,

              symbol: alert.symbol,

              currentPrice,

              targetPrice: alert.targetPrice,

              conditionType: alert.conditionType,

              isTriggered: true,

              triggeredAt: alert.triggeredAt,
            },
          });
        }
      }
    } catch (err) {
      logger.error(`Alert checker cron failed: ${err.message}`);
    }
  });

  // ================================
  // DAILY CRON JOB
  // ================================

  cron.schedule("0 0 * * *", async () => {
    try {
      logger.info("Daily cron running");

      // future cleanup / analytics logic
    } catch (err) {
      logger.error(`Daily cron failed: ${err.message}`);
    }
  });
};

module.exports = startCronJobs;