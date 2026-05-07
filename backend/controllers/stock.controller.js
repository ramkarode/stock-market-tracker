const stockService = require("../services/stock.service");
const defaultStocks = require("../constants/defaultStocks");

const { SuccessResponse, ErrorResponse } = require("../utils/responseHandlers");

/**
 * @method GET
 * @endpoint /stocks/homepage
 * @description fetch details of intial stocks for home page display
 */

const getHomepageStocks = async (req, res, next) => {
  try {
    const stocks = await stockService.getBulkQuotes(defaultStocks);

    return new SuccessResponse(res, "Homepage stocks fetched", stocks);
  } catch (err) {
    next(err);
  }
};

/**
 * @method GET
 * @endpoint /stocks/search
 * @description Search stocks
 */
const searchStocks = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return new ErrorResponse(res, "Keyword is required", {}, 400);
    }

    const stocks = await stockService.searchStocks(keyword);

    return new SuccessResponse(res, "Stocks fetched successfully", stocks);
  } catch (err) {
    next(err);
  }
};

/**
 * @method GET
 * @endpoint /stocks/quote/:symbol
 * @description Get single stock quote
 */
const getStockQuote = async (req, res, next) => {
  try {
    const { symbol } = req.params;

    const stock = await stockService.getStockQuote(symbol);

    return new SuccessResponse(res, "Stock quote fetched", stock);
  } catch (err) {
    next(err);
  }
};

/**
 * @method POST
 * @endpoint /stocks/bulk-quotes
 * @description Get multiple stock quotes
 */
const getBulkQuotes = async (req, res, next) => {
  try {
    const { symbols } = req.body;

    const quotes = await stockService.getBulkQuotes(symbols);

    return new SuccessResponse(res, "Bulk quotes fetched", quotes);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  searchStocks,
  getStockQuote,
  getBulkQuotes,
  getHomepageStocks
};
