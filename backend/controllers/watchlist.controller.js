const Watchlist = require("../models/watchlist.model");

const stockService = require("../services/stock.service");

const { SuccessResponse, ErrorResponse } = require("../utils/responseHandlers");

/**
 * @method POST
 * @endpoint /watchlist/add
 * @description Add stock to watchlist
 * @access Private
 */
const addToWatchlist = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { symbol, companyName } = req.body;

    if (!symbol || !companyName) {
      return new ErrorResponse(
        res,
        "Symbol and company name are required",
        {},
        400,
      );
    }

    // prevent duplicate entries
    const existing = await Watchlist.findOne({
      userId,
      symbol,
    });

    if (existing) {
      return new ErrorResponse(
        res,
        "Stock already exists in watchlist",
        {},
        400,
      );
    }

    const watchlistItem = await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      companyName,
    });

    return new SuccessResponse(
      res,
      "Stock added to watchlist",
      watchlistItem,
      201,
      true,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @method DELETE
 * @endpoint /watchlist/remove/:symbol
 * @description Remove stock from watchlist
 * @access Private
 */
const removeFromWatchlist = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { symbol } = req.params;

    const deleted = await Watchlist.findOneAndDelete({
      userId,
      symbol: symbol.toUpperCase(),
    });

    if (!deleted) {
      return new ErrorResponse(res, "Stock not found in watchlist", {}, 404);
    }

    return new SuccessResponse(
      res,
      "Stock removed from watchlist",
      {},
      200,
      true,
    );
  } catch (err) {
    next(err);
  }
};

/**
 * @method GET
 * @endpoint /watchlist
 * @description Get user watchlist with live stock prices
 * @access Private
 */
const getWatchlist = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const watchlist = await Watchlist.find({ userId }).sort({ createdAt: -1 });

    if (watchlist.length === 0) {
      return new SuccessResponse(
        res,
        "Watchlist fetched successfully",
        [],
        200,
      );
    }

    // extract symbols
    const symbols = watchlist.map((item) => item.symbol);

    // fetch live quotes
    const quotes = await stockService.getBulkQuotes(symbols);

    // create quick lookup map
    const quotesMap = new Map();

    quotes.forEach((quote) => {
      quotesMap.set(quote.symbol, quote);
    });

    // merge db data + live stock data
    const enhancedWatchlist = watchlist.map((item) => {
      const liveData = quotesMap.get(item.symbol);

      return {
        _id: item._id,
        symbol: item.symbol,
        companyName: item.companyName,

        livePrice: liveData?.price || null,
        change: liveData?.change || null,
        changePercent: liveData?.changePercent || null,

        createdAt: item.createdAt,
      };
    });

    return new SuccessResponse(
      res,
      "Watchlist fetched successfully",
      enhancedWatchlist,
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
};
