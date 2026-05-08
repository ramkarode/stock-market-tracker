const express = require("express");
const {
  createAlert,
  getAlerts,
  deleteAlert,
} = require("../controllers/alert.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.use(authMiddleware)

router.post("/create", createAlert);
router.get("/", getAlerts);
router.delete("/:id", deleteAlert);

module.exports = router;
