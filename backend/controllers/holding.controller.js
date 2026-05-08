// controllers/portfolio.controller.js

const Holding = require("../models/holding.model");

const { SuccessResponse, ErrorResponse } = require("../utils/responseHandlers");

const { getBulkQuotes } = require("../services/stock.service");

/**
 * =========================================================
 * @desc    Add stock holding to portfolio
 * @route   POST /api/portfolio/add
 * @access  Private
 *
 * @payload
 * {
 *   "symbol": "AAPL",
 *   "quantity": 10,
 *   "buyPrice": 180
 * }
 * =========================================================
 */
const addHolding = async (req, res) => {
  try {
    const userId = req.user._id;

    const { symbol, quantity, buyPrice } = req.body;

    /**
     * Basic validation
     */
    if (!symbol || !quantity || !buyPrice) {
      return new ErrorResponse(
        res,
        "symbol, quantity and buyPrice are required",
        {},
        400,
      );
    }

    /**
     * Create holding
     */
    const holding = await Holding.create({
      userId,
      symbol: symbol.toUpperCase(),
      quantity,
      buyPrice,
    });

    return new SuccessResponse(
      res,
      "Holding added successfully",
      holding,
      201,
      true,
    );
  } catch (error) {
    return new ErrorResponse(
      res,
      error.message || "Failed to add holding",
      {},
      500,
      true,
    );
  }
};

/**
 * =========================================================
 * @desc    Remove holding from portfolio
 * @route   DELETE /api/portfolio/remove/:id
 * @access  Private
 *
 * @params
 * id -> Holding MongoDB ID
 * =========================================================
 */
const removeHolding = async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;

    /**
     * Find holding
     */
    const holding = await Holding.findOne({
      _id: id,
      userId,
    });

    if (!holding) {
      return new ErrorResponse(res, "Holding not found", {}, 404);
    }

    /**
     * Delete holding
     */
    await holding.deleteOne();

    return new SuccessResponse(
      res,
      "Holding removed successfully",
      {},
      200,
      true,
    );
  } catch (error) {
    return new ErrorResponse(
      res,
      error.message || "Failed to remove holding",
      {},
      500,
      true,
    );
  }
};

/**
 * =========================================================
 * @desc    Get complete portfolio with analytics
 * @route   GET /api/portfolio
 * @access  Private
 *
 * @returns
 * - holdings[]
 * - summary
 * =========================================================
 */
const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    /**
     * Fetch all user holdings
     */
    const holdings = await Holding.find({ userId }).sort({
      createdAt: -1,
    });

    /**
     * Empty portfolio response
     */
    if (!holdings.length) {
      return new SuccessResponse(
        res,
        "Portfolio fetched successfully",
        {
          holdings: [],
          summary: {
            investedAmount: 0,
            currentAmount: 0,
            totalPnl: 0,
            totalPnlPercent: 0,
          },
        },
        200,
      );
    }

    /**
     * Get unique stock symbols
     */
    const symbols = [...new Set(holdings.map((h) => h.symbol))];

    /**
     * Fetch live quotes
     */
    const quotes = await getBulkQuotes(symbols);

    /**
     * Convert quotes array to map
     */
    const quotesMap = {};

    quotes.forEach((quote) => {
      quotesMap[quote.symbol] = quote;
    });

    let investedAmount = 0;
    let currentAmount = 0;

    /**
     * Enrich holdings with business calculations
     */
    const enrichedHoldings = holdings.map((holding) => {
      const liveQuote = quotesMap[holding.symbol];

      const currentPrice = liveQuote?.price || 0;

      const investedValue = holding.quantity * holding.buyPrice;

      const currentValue = holding.quantity * currentPrice;

      const pnl = currentValue - investedValue;

      const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0;

      investedAmount += investedValue;
      currentAmount += currentValue;

      return {
        _id: holding._id,

        symbol: holding.symbol,

        quantity: holding.quantity,

        buyPrice: holding.buyPrice,

        currentPrice: Number(currentPrice.toFixed(2)),

        investedValue: Number(investedValue.toFixed(2)),

        currentValue: Number(currentValue.toFixed(2)),

        pnl: Number(pnl.toFixed(2)),

        pnlPercent: Number(pnlPercent.toFixed(2)),

        latestTradingDay: liveQuote?.latestTradingDay || null,

        createdAt: holding.createdAt,

        updatedAt: holding.updatedAt,
      };
    });

    /**
     * Portfolio summary
     */
    const totalPnl = currentAmount - investedAmount;

    const totalPnlPercent =
      investedAmount > 0 ? (totalPnl / investedAmount) * 100 : 0;

    return new SuccessResponse(
      res,
      "Portfolio fetched successfully",
      {
        holdings: enrichedHoldings,

        summary: {
          investedAmount: Number(investedAmount.toFixed(2)),

          currentAmount: Number(currentAmount.toFixed(2)),

          totalPnl: Number(totalPnl.toFixed(2)),

          totalPnlPercent: Number(totalPnlPercent.toFixed(2)),
        },
      },
      200,
    );
  } catch (error) {
    return new ErrorResponse(
      res,
      error.message || "Failed to fetch portfolio",
      {},
      500,
      true,
    );
  }
};

module.exports = {
  addHolding,
  removeHolding,
  getPortfolio,
};
