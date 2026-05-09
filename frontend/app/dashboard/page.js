"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import axiosInstance from "../../services/axiosInstance"; // adjust path as needed
import {toast} from "react-hot-toast";

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n, decimals = 2) =>
  Number(n).toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const fmtVol = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n;
};

// ── sub-components ────────────────────────────────────────────────────────────

function StockCard({ stock }) {
  const isUp = stock.change >= 0;
  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="inline-block bg-slate-900 text-white text-xs font-mono font-semibold px-2.5 py-1 rounded-lg tracking-wider">
            {stock.symbol}
          </span>
          <p className="text-xs text-slate-400 mt-1.5">{stock.latestTradingDay}</p>
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
          }`}
        >
          <span>{isUp ? "▲" : "▼"}</span>
          {stock.changePercent}
        </span>
      </div>

      <p className="text-2xl font-bold text-slate-900 tracking-tight">
        ₹{fmt(stock.price)}
      </p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Change</p>
          <p className={`text-sm font-semibold ${isUp ? "text-emerald-600" : "text-red-500"}`}>
            {isUp ? "+" : ""}{fmt(stock.change)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 mb-0.5">Volume</p>
          <p className="text-sm font-semibold text-slate-700">{fmtVol(stock.volume)}</p>
        </div>
      </div>
    </div>
  );
}

function SearchResultCard({ stock, onAddToWatchlist, inWatchlist }) {
  return (
    <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-mono font-bold leading-none">
            {stock.symbol.slice(0, 2)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{stock.companyName}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs font-mono text-slate-400">{stock.symbol}</span>
            <span className="w-1 h-1 rounded-full bg-slate-200 flex-shrink-0" />
            <span className="text-xs text-slate-400">{stock.region}</span>
            <span className="w-1 h-1 rounded-full bg-slate-200 flex-shrink-0" />
            <span className="text-xs font-medium text-slate-500">{stock.currency}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onAddToWatchlist(stock)}
        className={`ml-3 flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${
          inWatchlist
            ? "bg-emerald-50 text-emerald-600 border-emerald-200 cursor-default"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900"
        }`}
      >
        {inWatchlist ? "✓ Added" : "+ Watchlist"}
      </button>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-7 w-20 bg-slate-100 rounded-lg" />
        <div className="h-6 w-16 bg-slate-100 rounded-full" />
      </div>
      <div className="h-8 w-28 bg-slate-100 rounded-lg mb-3" />
      <div className="pt-3 border-t border-slate-50 flex justify-between">
        <div className="h-4 w-16 bg-slate-100 rounded" />
        <div className="h-4 w-16 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [homeStocks, setHomeStocks] = useState([]);
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeError, setHomeError] = useState(null);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = no search yet
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [watchlist, setWatchlist] = useState([]);

  const debounceTimer = useRef(null);

  // fetch homepage stocks
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/stocks/homepage");
        if (res.data.success) setHomeStocks(res.data.data);
      } catch {
        setHomeError("Failed to load market data.");
      } finally {
        setHomeLoading(false);
      }
    })();
  }, []);

  // debounced search
  const handleSearch = useCallback((value) => {
    setQuery(value);
    clearTimeout(debounceTimer.current);

    if (!value.trim()) {
      setSearchResults(null);
      setSearchError(null);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError(null);
      try {
        const res = await axiosInstance.get(`/stocks/search?keyword=${encodeURIComponent(value.trim())}`);
        if (res.data.success) setSearchResults(res.data.data);
      } catch {
        setSearchError("Search failed. Please try again.");
        setSearchResults(null);
      } finally {
        setSearchLoading(false);
      }
    }, 500);
  }, []);

  const addToWatchlist = (stock) => {

    let payload ={
      symbol: stock.symbol,
      companyName: stock.companyName,
    }

    axiosInstance.post("/watchlist/add", payload)
    .then((res) => {
      if(res.data.success){
        toast.success("Added to watchlist");
        console.log("Added to watchlist");
      }
    })
    .catch((err) => {
      console.error("Failed to add to watchlist", err);
    })

    setWatchlist((prev) =>
      prev.some((s) => s.symbol === stock.symbol) ? prev : [...prev, stock]
    );
  };

  const isInWatchlist = (symbol) => watchlist.some((s) => s.symbol === symbol);

  const showSearch = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── header ── */}
  

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── search ── */}
        <section>
          <div className="relative max-w-xl">
            <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search stocks — symbol or company name…"
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
            />
            {searchLoading && (
              <span className="absolute inset-y-0 right-3.5 flex items-center">
                <svg className="w-4 h-4 text-slate-400 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            )}
          </div>
        </section>

        {/* ── search results ── */}
        {showSearch && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Search Results</h2>
              {searchResults && (
                <span className="text-xs text-slate-400">{searchResults.length} found</span>
              )}
            </div>

            {searchError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {searchError}
              </p>
            )}

            {!searchLoading && searchResults && searchResults.length === 0 && (
              <p className="text-sm text-slate-400 py-4">No results for &quot;{query}&quot;</p>
            )}

            {searchResults && searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((s) => (
                  <SearchResultCard
                    key={s.symbol}
                    stock={s}
                    onAddToWatchlist={addToWatchlist}
                    inWatchlist={isInWatchlist(s.symbol)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── market overview ── */}
        {!showSearch && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Market Overview</h2>
                <p className="text-xs text-slate-400 mt-0.5">Live snapshot · updated today</p>
              </div>
            </div>

            {homeError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {homeError}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {homeLoading
                ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
                : homeStocks.map((s) => <StockCard key={s.symbol} stock={s} />)
              }
            </div>

            {!homeLoading && homeStocks.length === 0 && !homeError && (
              <p className="text-sm text-slate-400 py-6 text-center">No market data available.</p>
            )}
          </section>
        )}

        {/* ── watchlist strip ── */}
        {watchlist.length > 0 && (
          <section className="border-t border-slate-100 pt-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">My Watchlist</h2>
            <div className="flex flex-wrap gap-2">
              {watchlist.map((s) => (
                <div
                  key={s.symbol}
                  className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm shadow-sm"
                >
                  <span className="font-mono text-xs font-bold text-slate-700">{s.symbol}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500 truncate max-w-[120px]">{s.companyName}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}