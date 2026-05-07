const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");

const {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} = require("../controllers/watchlist.controller");

const router = express.Router();

// protected routes
router.use(authMiddleware);

router.post("/add", addToWatchlist);

router.delete("/remove/:symbol", removeFromWatchlist);

router.get("/", getWatchlist);

module.exports = router;