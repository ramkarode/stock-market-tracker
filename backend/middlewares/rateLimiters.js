const rateLimit = require("express-rate-limit");

const stockApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute

  max: 20, // 20 requests per minute per IP

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many stock requests. Please try again later.",
  },
});

module.exports = {
  stockApiLimiter,
};
