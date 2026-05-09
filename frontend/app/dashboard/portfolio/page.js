"use client"
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../services/axiosInstance"; // adjust path as needed

// ─────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────
const fmt = (val, prefix = "") => {
  if (val == null || val === 0) return `${prefix}0.00`;
  return `${prefix}${Math.abs(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const sign = (val) => (val >= 0 ? "+" : "-");
const isPos = (val) => val >= 0;

// ─────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-gray-100 ${className}`} />
);

// ─────────────────────────────────────────────
// PnlBadge
// ─────────────────────────────────────────────
const PnlBadge = ({ value, percent, size = "sm" }) => {
  const positive = isPos(value);
  const base =
    size === "lg"
      ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
      : "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold";
  const color = positive
    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
    : "bg-red-50 text-red-500 border border-red-100";
  const arrow = positive ? "▲" : "▼";

  return (
    <span className={`${base} ${color}`}>
      <span>{arrow}</span>
      <span>
        {sign(value)}₹{fmt(value)} ({sign(percent)}
        {Math.abs(percent).toFixed(2)}%)
      </span>
    </span>
  );
};

// ─────────────────────────────────────────────
// PortfolioSummary
// ─────────────────────────────────────────────
const PortfolioSummary = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  const { investedAmount, currentAmount, totalPnl, totalPnlPercent } =
    summary || {};
  const positive = isPos(totalPnl);

  const tiles = [
    { label: "Invested", value: `₹${fmt(investedAmount)}`, accent: false },
    { label: "Current Value", value: `₹${fmt(currentAmount)}`, accent: false },
    {
      label: "Total P&L",
      value: `${sign(totalPnl)}₹${fmt(totalPnl)}`,
      accent: true,
      positive,
    },
    {
      label: "Returns",
      value: `${sign(totalPnlPercent)}${Math.abs(totalPnlPercent ?? 0).toFixed(2)}%`,
      accent: true,
      positive,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5">
        Portfolio Summary
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {tiles.map((t) => (
          <div
            key={t.label}
            className={`rounded-xl p-4 ${
              t.accent
                ? t.positive
                  ? "bg-emerald-50 border border-emerald-100"
                  : "bg-red-50 border border-red-100"
                : "bg-gray-50 border border-gray-100"
            }`}
          >
            <p className="text-xs text-gray-400 mb-1">{t.label}</p>
            <p
              className={`text-lg font-bold leading-tight ${
                t.accent
                  ? t.positive
                    ? "text-emerald-600"
                    : "text-red-500"
                  : "text-gray-700"
              }`}
            >
              {t.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// HoldingCard  – spotlight on top holding
// ─────────────────────────────────────────────
const HoldingCard = ({ holding, loading }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-36" />
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      </div>
    );
  }

  if (!holding) return null;

  const {
    symbol,
    quantity,
    buyPrice,
    currentPrice,
    investedValue,
    currentValue,
    pnl,
    pnlPercent,
    latestTradingDay,
  } = holding;

  const positive = isPos(pnl);

  return (
    <div
      className={`rounded-2xl border shadow-sm p-6 relative overflow-hidden ${
        positive
          ? "bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-600"
          : "bg-gradient-to-br from-red-900 to-red-900 border-red-600"
      }`}
    >
      {/* decorative circle */}
      {/* <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 bg-white" />
      <div className="absolute -bottom-12 -right-4 w-56 h-56 rounded-full opacity-10 bg-white" /> */}

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full tracking-wider mb-2">
              TOP HOLDING
            </span>
            <h3 className="text-white text-2xl font-bold">{symbol}</h3>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs">Qty</p>
            <p className="text-white font-bold text-xl">{quantity}</p>
          </div>
        </div>

        <p className="text-white text-3xl font-extrabold mb-1">
          ₹{fmt(currentValue || investedValue)}
        </p>

        <div className="mb-5">
          <span
            className={`inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
              positive
                ? "bg-white/20 text-white"
                : "bg-white/10 text-red-200"
            }`}
          >
            {positive ? "▲" : "▼"} {sign(pnl)}₹{fmt(pnl)} (
            {sign(pnlPercent)}
            {Math.abs(pnlPercent ?? 0).toFixed(2)}%)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Buy Price", value: `₹${fmt(buyPrice)}` },
            { label: "Cur. Price", value: currentPrice ? `₹${fmt(currentPrice)}` : "—" },
            { label: "Invested", value: `₹${fmt(investedValue)}` },
            {
              label: "Last Updated",
              value: latestTradingDay
                ? new Date(latestTradingDay).toLocaleDateString("en-IN")
                : "—",
            },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 rounded-xl p-3">
              <p className="text-white/60 text-xs mb-0.5">{item.label}</p>
              <p className="text-white font-semibold text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// HoldingsTable
// ─────────────────────────────────────────────
const HoldingsTable = ({ holdings, loading }) => {
  const headers = [
    "Symbol",
    "Qty",
    "Buy Price",
    "Cur. Price",
    "Invested",
    "Current",
    "P&L",
    "Return %",
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <Skeleton className="h-5 w-36" />
        </div>
        <div className="p-4 space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!holdings?.length) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-12 text-center">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-gray-500 font-medium">No holdings found</p>
        <p className="text-gray-400 text-sm mt-1">
          Start investing to see your portfolio here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
          All Holdings
        </h2>
        <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2.5 py-1 rounded-full">
          {holdings.length} stock{holdings.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/70">
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {holdings.map((h) => {
              const pos = isPos(h.pnl);
              return (
                <tr
                  key={h._id}
                  className="hover:bg-gray-50/50 transition-colors duration-150"
                >
                  <td className="px-5 py-4">
                    <span className="font-bold text-gray-800">{h.symbol}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{h.quantity}</td>
                  <td className="px-5 py-4 text-gray-600">
                    ₹{fmt(h.buyPrice)}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {h.currentPrice ? `₹${fmt(h.currentPrice)}` : "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    ₹{fmt(h.investedValue)}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {h.currentValue ? `₹${fmt(h.currentValue)}` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`font-semibold ${
                        pos ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {sign(h.pnl)}₹{fmt(h.pnl)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <PnlBadge value={h.pnl} percent={h.pnlPercent} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-gray-50">
        {holdings.map((h) => {
          const pos = isPos(h.pnl);
          return (
            <div key={h._id} className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-bold text-gray-800 text-base">
                    {h.symbol}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    Qty: {h.quantity}
                  </span>
                </div>
                <PnlBadge value={h.pnl} percent={h.pnlPercent} />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-gray-400">Buy Price</span>
                <span className="text-gray-700 text-right">
                  ₹{fmt(h.buyPrice)}
                </span>
                <span className="text-gray-400">Cur. Price</span>
                <span className="text-gray-700 text-right">
                  {h.currentPrice ? `₹${fmt(h.currentPrice)}` : "—"}
                </span>
                <span className="text-gray-400">Invested</span>
                <span className="text-gray-700 text-right">
                  ₹{fmt(h.investedValue)}
                </span>
                <span className="text-gray-400">P&L</span>
                <span
                  className={`text-right font-semibold ${
                    pos ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {sign(h.pnl)}₹{fmt(h.pnl)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Error state
// ─────────────────────────────────────────────
const ErrorState = ({ message, onRetry }) => (
  <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
    <p className="text-3xl mb-3">⚠️</p>
    <p className="text-red-600 font-semibold">{message}</p>
    <button
      onClick={onRetry}
      className="mt-4 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
    >
      Retry
    </button>
  </div>
);

// ─────────────────────────────────────────────
// PortfolioPage  (root)
// ─────────────────────────────────────────────
const PortfolioPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchPortfolio = () => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    axiosInstance
      .get("/portfolio", { signal: abortRef.current.signal })
      .then((res) => {
        if (res.data?.success) setData(res.data.data);
        else setError("Failed to load portfolio.");
      })
      .catch((err) => {
        // Ignore abort errors (user navigated away)
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
        setError(err?.response?.data?.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPortfolio();

    // Cleanup: abort on unmount (page switch)
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const topHolding = data?.holdings?.[0] ?? null;

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 sm:px-6 py-6 pb-28">
      {/* ── Heading ── */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#44475b] tracking-tight">
          Your Portfolio
        </h1>
        <p className="text-gray-400 mt-1.5 text-sm">
          Track your investments &amp; returns
        </p>
      </div>

      {/* ── Error ── */}
      {error && !loading && (
        <div className="mb-6">
          <ErrorState message={error} onRetry={fetchPortfolio} />
        </div>
      )}

      {/* ── Summary + Top Holding Card ── */}
      {!error && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
            <PortfolioSummary summary={data?.summary} loading={loading} />
            <HoldingCard holding={topHolding} loading={loading} />
          </div>

          {/* ── Holdings Table ── */}
          <HoldingsTable holdings={data?.holdings} loading={loading} />
        </>
      )}
    </div>
  );
};

export default PortfolioPage;