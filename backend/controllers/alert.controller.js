const Alert = require("../models/alert.model");

const {
  SuccessResponse,
  ErrorResponse,
} = require("../utils/responseHandlers");

/**
 * @method POST
 * @endpoint /api/alerts/create
 * @description Create stock price alert
 * @access Private
 */
const createAlert = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const {
      symbol,
      conditionType,
      targetPrice,
    } = req.body;

    // validations
    if (!symbol) {
      return new ErrorResponse(
        res,
        "Symbol is required",
        {},
        400
      );
    }

    if (!conditionType) {
      return new ErrorResponse(
        res,
        "Condition type is required",
        {},
        400
      );
    }

    if (!["gt", "lt"].includes(conditionType)) {
      return new ErrorResponse(
        res,
        "Condition type must be gt or lt",
        {},
        400
      );
    }

    if (
      targetPrice === undefined ||
      targetPrice === null
    ) {
      return new ErrorResponse(
        res,
        "Target price is required",
        {},
        400
      );
    }

    if (Number(targetPrice) <= 0) {
      return new ErrorResponse(
        res,
        "Target price must be greater than 0",
        {},
        400
      );
    }

    const alert = await Alert.create({
      userId,
      symbol: symbol.toUpperCase(),
      conditionType,
      targetPrice,
    });

    return new SuccessResponse(
      res,
      "Alert created successfully",
      alert,
      201,
      true
    );

  } catch (err) {
    next(err);
  }
};

/**
 * @method GET
 * @endpoint /api/alerts
 * @description Get all user alerts
 * @access Private
 */
const getAlerts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const alerts = await Alert.find({ userId })
      .sort({ createdAt: -1 });

    return new SuccessResponse(
      res,
      "Alerts fetched successfully",
      alerts
    );

  } catch (err) {
    next(err);
  }
};

/**
 * @method DELETE
 * @endpoint /api/alerts/:id
 * @description Delete alert
 * @access Private
 */
const deleteAlert = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;

    const deletedAlert = await Alert.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedAlert) {
      return new ErrorResponse(
        res,
        "Alert not found",
        {},
        404
      );
    }

    return new SuccessResponse(
      res,
      "Alert deleted successfully",
      {},
      200,
      true
    );

  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAlert,
  getAlerts,
  deleteAlert,
};