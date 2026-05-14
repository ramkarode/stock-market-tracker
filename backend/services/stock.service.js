require("dotenv").config();
const axios = require("axios");
const logger = require("../config/logger");

const BASE_URL = "https://finnhub.io/api/v1";

const API_KEY = process.env.FINNHUB_API_KEY;

/**
 * @function searchStocks
 * @description Search stocks by keyword
 */
const searchStocks = async (keyword) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        q: keyword,
        token: API_KEY,
      },
    });

    const matches = response.data.result || [];

    return matches.map((stock) => ({
      symbol: stock.symbol,
      companyName: stock.description,
      type: stock.type,
      displaySymbol: stock.displaySymbol,
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
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol,
        token: API_KEY,
      },
    });

    const quote = response.data;

    if (!quote || Object.keys(quote).length === 0) {
      throw new Error("Quote not found");
    }

    return {
      symbol,
      price: Number(quote.c), // Current price
      change: Number(quote.d), // Change
      changePercent: Number(quote.dp), // % change
      high: Number(quote.h),
      low: Number(quote.l),
      open: Number(quote.o),
      previousClose: Number(quote.pc),
      timestamp: quote.t,
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