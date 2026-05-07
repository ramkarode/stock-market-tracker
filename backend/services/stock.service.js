const axios = require("axios");
const logger = require("../config/logger");

const BASE_URL = "https://www.alphavantage.co/query";

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

/**
 * @function searchStocks
 * @description Search stocks by keyword
 */
const searchStocks = async (keyword) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: "SYMBOL_SEARCH",
        keywords: keyword,
        apikey: API_KEY,
      },
    });

    const matches = response.data.bestMatches || [];

    return matches.map((stock) => ({
      symbol: stock["1. symbol"],
      companyName: stock["2. name"],
      region: stock["4. region"],
      currency: stock["8. currency"],
    }));

  } catch (err) {
    logger.error(`Stock search failed: ${err.message}`);
    throw new Error("Failed to search stocks");
  }
};

/**
 * @function getStockQuote
 * @description Get single stock live quote
 */
const getStockQuote = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: "GLOBAL_QUOTE",
        symbol,
        apikey: API_KEY,
      },
    });

    const quote = response.data["Global Quote"];

    if (!quote || Object.keys(quote).length === 0) {
      throw new Error("Quote not found");
    }

    return {
      symbol: quote["01. symbol"],
      price: Number(quote["05. price"]),
      change: Number(quote["09. change"]),
      changePercent: quote["10. change percent"],
      volume: Number(quote["06. volume"]),
      latestTradingDay: quote["07. latest trading day"],
    };

  } catch (err) {
    logger.error(`Stock quote failed (${symbol}): ${err.message}`);
    throw new Error("Failed to fetch stock quote");
  }
};

/**
 * @function getBulkQuotes
 * @description Get quotes for multiple stocks
 */
const getBulkQuotes = async (symbolsArray = []) => {
  try {
    if (!Array.isArray(symbolsArray) || symbolsArray.length === 0) {
      return [];
    }

    const quotes = await Promise.allSettled(
      symbolsArray.map((symbol) => getStockQuote(symbol))
    );

    return quotes
      .filter((q) => q.status === "fulfilled")
      .map((q) => q.value);

  } catch (err) {
    logger.error(`Bulk quotes failed: ${err.message}`);
    throw new Error("Failed to fetch bulk quotes");
  }
};

module.exports = {
  searchStocks,
  getStockQuote,
  getBulkQuotes,
};