const express = require("express");

const {
  signup,
  login,
  logout,
  verifyLogin,
  getMe,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/verify-login", authMiddleware, verifyLogin);
router.get("/me", authMiddleware, getMe);

module.exports = router;