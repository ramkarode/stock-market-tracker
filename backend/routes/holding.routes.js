// routes/portfolio.routes.js

const express = require("express");

const router = express.Router();

const {
  addHolding,
  removeHolding,
  getPortfolio,
} = require("../controllers/holding.controller");
const authMiddleware = require("../middlewares/auth.middleware");



router.use(authMiddleware);

router.post("/add", addHolding);

router.delete("/remove/:id", removeHolding);

router.get("/",  getPortfolio);

module.exports = router;
