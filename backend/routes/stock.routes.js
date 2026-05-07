const express = require("express");

const {
  searchStocks,
  getStockQuote,
  getBulkQuotes,
  getHomepageStocks,
} = require("../controllers/stock.controller");
const { stockApiLimiter } = require("../middlewares/rateLimiters");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(stockApiLimiter); //rate limiting as free tier gives limited request and to prevent abuse
router.use(authMiddleware);
router.get("/search", searchStocks);

router.get("/quote/:symbol", getStockQuote);

router.post("/bulk-quotes", getBulkQuotes);

router.get("/homepage", getHomepageStocks);

module.exports = router;