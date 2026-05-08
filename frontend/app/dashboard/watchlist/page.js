"use client";

import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../../services/axiosInstance"; // adjust path as needed

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const ITEMS_PER_PAGE = 8;

// ── filter bar ────────────────────────────────────────────────────────────────
function FilterBar({ filter, setFilter, sort, setSort, total, filtered }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* search */}
      <div className="relative flex-1 max-w-sm">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by symbol or name…"
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition shadow-sm"
        />
        {filter && (
          <button
            onClick={() => setFilter("")}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent shadow-sm cursor-pointer"
        >
          <option value="default">Sort: Default</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="change_asc">Change ↑</option>
          <option value="change_desc">Change ↓</option>
          <option value="name_asc">Name A–Z</option>
          <option value="name_desc">Name Z–A</option>
        </select>

        {/* count badge */}
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {filtered} of {total}
        </span>
      </div>
    </div>
  );
}

// ── stock tile ────────────────────────────────────────────────────────────────
function WatchlistTile({ item }) {
  const isUp = item.change >= 0;
  return (
    <div className="group bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-4">
        {/* left — symbol + name */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-mono font-bold leading-none">
              {item.symbol.slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{item.companyName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-mono text-slate-400 truncate">{item.symbol}</span>
              <span className="text-slate-200">·</span>
              <span className="text-xs text-slate-400">{fmtDate(item.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* right — price + change */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* change */}
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400 mb-0.5">Change</p>
            <p className={`text-sm font-semibold ${isUp ? "text-emerald-600" : "text-red-500"}`}>
              {isUp ? "+" : ""}{fmt(item.change)}
            </p>
          </div>

          {/* percent badge */}
          <span
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
            }`}
          >
            <span>{isUp ? "▲" : "▼"}</span>
            {item.changePercent?.replace("-", "")}
          </span>

          {/* price */}
          <div className="text-right min-w-[72px]">
            <p className="text-xs text-slate-400 mb-0.5">Price</p>
            <p className="text-base font-bold text-slate-900">₹{fmt(item.livePrice)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-slate-100 rounded" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-16 bg-slate-100 rounded-full" />
          <div className="h-5 w-20 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
            p === page
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function WatchlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

useEffect(() => {
  let abortController = new AbortController();
  console.log("Fetching watchlist...");

  const fetchWatchlist = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await axiosInstance.get("/watchlist", {
        signal: abortController.signal,
      });
      if (res.data.success) setItems(res.data.data);
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") return;
      if (!silent) setError("Failed to load your watchlist. Please try again.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // initial fetch
  fetchWatchlist(false);

  // poll every 60s — silent update (no loading spinner)
  const intervalId = setInterval(() => {
    abortController = new AbortController(); // fresh controller each tick
    fetchWatchlist(true);
    console.log("Watchlist updated"); // for debugging
  }, 60000);

  // cleanup — cancel in-flight request + stop interval
  return () => {
    abortController.abort();
    clearInterval(intervalId);
  };
}, []);

  // filter + sort
  const processed = useMemo(() => {
    let list = [...items];

    if (filter.trim()) {
      const q = filter.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.companyName.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price_asc":   list.sort((a, b) => a.livePrice - b.livePrice); break;
      case "price_desc":  list.sort((a, b) => b.livePrice - a.livePrice); break;
      case "change_asc":  list.sort((a, b) => a.change - b.change); break;
      case "change_desc": list.sort((a, b) => b.change - a.change); break;
      case "name_asc":    list.sort((a, b) => a.companyName.localeCompare(b.companyName)); break;
      case "name_desc":   list.sort((a, b) => b.companyName.localeCompare(a.companyName)); break;
      default: break;
    }

    return list;
  }, [items, filter, sort]);

  // reset page on filter/sort change
  useEffect(() => { setPage(1); }, [filter, sort]);

  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE);
  const paginated = processed.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // stats
  const gainers = items.filter((s) => s.change >= 0).length;
  const losers = items.length - gainers;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── header ── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">Watchlist</span>
          </div>

          {!loading && !error && items.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-emerald-50 text-emerald-600 font-semibold px-2 py-1 rounded-full">
                ▲ {gainers}
              </span>
              <span className="bg-red-50 text-red-500 font-semibold px-2 py-1 rounded-full">
                ▼ {losers}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* ── filter bar ── */}
        {!loading && !error && items.length > 0 && (
          <FilterBar
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            total={items.length}
            filtered={processed.length}
          />
        )}

        {/* ── error ── */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* ── loading ── */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {/* ── empty state ── */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-slate-700 font-semibold text-sm">Your watchlist is empty</p>
            <p className="text-slate-400 text-xs mt-1">Search for stocks and add them to track here.</p>
          </div>
        )}

        {/* ── no filter results ── */}
        {!loading && !error && items.length > 0 && processed.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-slate-500">No stocks match <span className="font-semibold">&quot;{filter}&quot;</span></p>
            <button onClick={() => setFilter("")} className="mt-2 text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition">
              Clear filter
            </button>
          </div>
        )}

        {/* ── list ── */}
        {!loading && paginated.length > 0 && (
          <div className="space-y-2.5">
            {paginated.map((item) => (
              <WatchlistTile key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* ── pagination ── */}
        {!loading && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        )}

      </main>
    </div>
  );
}