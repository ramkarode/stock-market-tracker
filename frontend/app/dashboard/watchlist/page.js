"use client";

import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { buyStockApi } from "../../../services/apiCollections";
import { Confirm, Notify } from "notiflix";

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const ITEMS_PER_PAGE = 8;

// ── buy modal ─────────────────────────────────────────────────────────────────
function BuyModal({ item, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const totalCost = quantity * item.livePrice;
  const isUp = item.change >= 0;

  const handleBuy = async () => {
    if (quantity < 1) return;
    setLoading(true);
    setError(null);

    try {
      const res = await buyStockApi({
        symbol: item.symbol,
        quantity: Number(quantity),
        buyPrice: item.livePrice,
      });
      if (res.success || res.status === 200 || res.status === 201) {
        setSuccess(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const BuyStock = () => {
    Confirm.show(
      "Buy Stock",
      "Confirm to Buy Stock and add them to holdings",
      "Buy",
      "cancel",
      handleBuy,
      () => {
        Notify.info("cancelled!!");
      },
    );
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
      onClick={handleBackdrop}
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* header */}
        <div className="px-6 pt-4 pb-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-mono font-bold">
                  {item.symbol.slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {item.companyName}
                </p>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  {item.symbol}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* live price row */}
          <div className="mt-4 flex items-end gap-3">
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              ₹{fmt(item.livePrice)}
            </p>
            <span
              className={`mb-1 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                isUp
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-500"
              }`}
            >
              <span>{isUp ? "▲" : "▼"}</span>
              {item.changePercent?.replace("-", "")}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Current Market Price</p>
        </div>

        {/* body */}
        {!success ? (
          <div className="px-6 py-5 space-y-5">
            {/* quantity input */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg transition active:scale-95"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="flex-1 text-center text-lg font-bold text-slate-900 border border-slate-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg transition active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* order summary */}
            <div className="bg-slate-50 rounded-xl px-4 py-4 space-y-2.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Order Summary
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Price per share</span>
                <span className="font-semibold text-slate-800">
                  ₹{fmt(item.livePrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Quantity</span>
                <span className="font-semibold text-slate-800">{quantity}</span>
              </div>
              <div className="border-t border-slate-200 pt-2.5 flex justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  Total Cost
                </span>
                <span className="text-base font-bold text-slate-900">
                  ₹{fmt(totalCost)}
                </span>
              </div>
            </div>

            {/* error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* cta */}
            <button
              onClick={BuyStock}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-700 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Placing Order…
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Buy {item.symbol}
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-400">
              Order will be placed at current market price
            </p>
          </div>
        ) : (
          /* success state */
          <div className="px-6 py-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-base font-bold text-slate-900">Order Placed!</p>
            <p className="text-sm text-slate-500 mt-1">
              You bought{" "}
              <span className="font-semibold text-slate-700">
                {quantity} shares
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {item.symbol}
              </span>{" "}
              at ₹{fmt(item.livePrice)}
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm py-3.5 rounded-xl transition"
            >
              Done
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}

// ── alert modal ───────────────────────────────────────────────────────────────
function AlertModal({ item, onClose }) {
  const [conditionType, setConditionType] = useState("gt");
  const [targetPrice, setTargetPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isUp = item.change >= 0;

  const handleCreateAlert = async () => {
    const price = parseFloat(targetPrice);
    if (!targetPrice || isNaN(price) || price <= 0) {
      setError("Please enter a valid target price.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post("/alert/create", {
        symbol: item.symbol,
        conditionType,
        targetPrice: price,
      });
      if (
        res.data?.success ||
        res.status === 200 ||
        res.status === 201
      ) {
        setSuccess(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to create alert. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const ConfirmAlert = () => {
    const price = parseFloat(targetPrice);
    if (!targetPrice || isNaN(price) || price <= 0) {
      setError("Please enter a valid target price.");
      return;
    }
    Confirm.show(
      "Set Price Alert",
      `Alert when ${item.symbol} goes ${conditionType === "gt" ? "above" : "below"} ₹${fmt(price)}`,
      "Set Alert",
      "Cancel",
      handleCreateAlert,
      () => {
        Notify.info("Cancelled!");
      },
    );
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
      onClick={handleBackdrop}
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* header */}
        <div className="px-6 pt-4 pb-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  Set Price Alert
                </p>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  {item.symbol} · {item.companyName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* live price row */}
          <div className="mt-4 flex items-end gap-3">
            <p className="text-3xl font-bold text-slate-900 tracking-tight">
              ₹{fmt(item.livePrice)}
            </p>
            <span
              className={`mb-1 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                isUp
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-500"
              }`}
            >
              <span>{isUp ? "▲" : "▼"}</span>
              {item.changePercent?.replace("-", "")}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Current Market Price</p>
        </div>

        {/* body */}
        {!success ? (
          <div className="px-6 py-5 space-y-5">
            {/* condition type toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Alert Condition
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setConditionType("gt")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    conditionType === "gt"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <span className="text-base leading-none">▲</span>
                  Price Goes Above
                </button>
                <button
                  onClick={() => setConditionType("lt")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    conditionType === "lt"
                      ? "bg-white text-red-500 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <span className="text-base leading-none">▼</span>
                  Price Goes Below
                </button>
              </div>
            </div>

            {/* target price input */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Target Price
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 font-semibold text-sm pointer-events-none">
                  ₹
                </span>
                <input
                  type="number"
                  min={0.01}
                  step={0.01}
                  value={targetPrice}
                  onChange={(e) => {
                    setTargetPrice(e.target.value);
                    setError(null);
                  }}
                  placeholder="0.00"
                  className="w-full text-left text-lg font-bold text-slate-900 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition placeholder:font-normal placeholder:text-slate-300 placeholder:text-base"
                />
              </div>
            </div>

            {/* alert summary */}
            <div className="bg-slate-50 rounded-xl px-4 py-4 space-y-2.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Alert Summary
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Symbol</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {item.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Condition</span>
                <span
                  className={`font-semibold ${conditionType === "gt" ? "text-emerald-600" : "text-red-500"}`}
                >
                  {conditionType === "gt" ? "Above ▲" : "Below ▼"}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2.5 flex justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  Target Price
                </span>
                <span className="text-base font-bold text-slate-900">
                  {targetPrice ? `₹${fmt(targetPrice)}` : "—"}
                </span>
              </div>
            </div>

            {/* error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* cta */}
            <button
              onClick={ConfirmAlert}
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Creating Alert…
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  Set Alert for {item.symbol}
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-400">
              You'll be notified when the condition is met
            </p>
          </div>
        ) : (
          /* success state */
          <div className="px-6 py-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-base font-bold text-slate-900">Alert Created!</p>
            <p className="text-sm text-slate-500 mt-1">
              You'll be notified when{" "}
              <span className="font-semibold text-slate-700">{item.symbol}</span>{" "}
              goes{" "}
              <span
                className={`font-semibold ${conditionType === "gt" ? "text-emerald-600" : "text-red-500"}`}
              >
                {conditionType === "gt" ? "above" : "below"}
              </span>{" "}
              <span className="font-semibold text-slate-700">
                ₹{fmt(targetPrice)}
              </span>
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm py-3.5 rounded-xl transition"
            >
              Done
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}

// ── filter bar ────────────────────────────────────────────────────────────────
function FilterBar({ filter, setFilter, sort, setSort, total, filtered }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
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
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
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

        <span className="text-xs text-slate-400 whitespace-nowrap">
          {filtered} of {total}
        </span>
      </div>
    </div>
  );
}

// ── stock tile ────────────────────────────────────────────────────────────────
function WatchlistTile({ item, onBuy, onAlert }) {
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
            <p className="text-sm font-bold text-slate-900 truncate">
              {item.companyName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-mono text-slate-400 truncate">
                {item.symbol}
              </span>
              <span className="text-slate-200">·</span>
              <span className="text-xs text-slate-400">
                {fmtDate(item.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* right — price + change + action buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* change */}
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400 mb-0.5">Change</p>
            <p
              className={`text-sm font-semibold ${isUp ? "text-emerald-600" : "text-red-500"}`}
            >
              {isUp ? "+" : ""}
              {fmt(item.change)}
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
            <p className="text-base font-bold text-slate-900">
              ₹{fmt(item.livePrice)}
            </p>
          </div>

          {/* alert button */}
          <button
            onClick={() => onAlert(item)}
            title="Set Price Alert"
            className="flex-shrink-0 bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-500 hover:text-amber-600 text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-1"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="hidden sm:inline">Alert</span>
          </button>

          {/* buy button */}
          <button
            onClick={() => onBuy(item)}
            className="flex-shrink-0 bg-slate-900 hover:bg-slate-700 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-150"
          >
            Buy
          </button>
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
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
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
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
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

  const [buyItem, setBuyItem] = useState(null);
  const [alertItem, setAlertItem] = useState(null);

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
        if (!silent)
          setError("Failed to load your watchlist. Please try again.");
      } finally {
        if (!silent) setLoading(false);
      }
    };

    fetchWatchlist(false);

    const intervalId = setInterval(() => {
      abortController = new AbortController();
      fetchWatchlist(true);
      console.log("Watchlist updated");
    }, 60000);

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
          s.companyName.toLowerCase().includes(q),
      );
    }

    switch (sort) {
      case "price_asc":
        list.sort((a, b) => a.livePrice - b.livePrice);
        break;
      case "price_desc":
        list.sort((a, b) => b.livePrice - a.livePrice);
        break;
      case "change_asc":
        list.sort((a, b) => a.change - b.change);
        break;
      case "change_desc":
        list.sort((a, b) => b.change - a.change);
        break;
      case "name_asc":
        list.sort((a, b) => a.companyName.localeCompare(b.companyName));
        break;
      case "name_desc":
        list.sort((a, b) => b.companyName.localeCompare(a.companyName));
        break;
      default:
        break;
    }

    return list;
  }, [items, filter, sort]);

  useEffect(() => {
    setPage(1);
  }, [filter, sort]);

  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE);
  const paginated = processed.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const gainers = items.filter((s) => s.change >= 0).length;
  const losers = items.length - gainers;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── header ── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Watchlist
            </span>
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
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        )}

        {/* ── empty state ── */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <p className="text-slate-700 font-semibold text-sm">
              Your watchlist is empty
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Search for stocks and add them to track here.
            </p>
          </div>
        )}

        {/* ── no filter results ── */}
        {!loading && !error && items.length > 0 && processed.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-slate-500">
              No stocks match{" "}
              <span className="font-semibold">&quot;{filter}&quot;</span>
            </p>
            <button
              onClick={() => setFilter("")}
              className="mt-2 text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* ── list ── */}
        {!loading && paginated.length > 0 && (
          <div className="space-y-2.5">
            {paginated.map((item) => (
              <WatchlistTile
                key={item._id}
                item={item}
                onBuy={setBuyItem}
                onAlert={setAlertItem}
              />
            ))}
          </div>
        )}

        {/* ── pagination ── */}
        {!loading && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        )}
      </main>

      {/* ── buy modal ── */}
      {buyItem && <BuyModal item={buyItem} onClose={() => setBuyItem(null)} />}

      {/* ── alert modal ── */}
      {alertItem && (
        <AlertModal item={alertItem} onClose={() => setAlertItem(null)} />
      )}
    </div>
  );
}