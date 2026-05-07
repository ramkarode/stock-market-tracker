const logger = require("../config/logger");
class SuccessResponse {
  constructor(res, message, data = {}, statusCode = 200, log = false) {
    if (log) logger.info(message);

    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
}
class ErrorResponse {
  constructor(res, message, data = {}, statusCode = 200, log = false) {
    if (log) logger.info(message);

    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
}

module.exports = { SuccessResponse };
