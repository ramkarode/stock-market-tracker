"use client";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../services/axiosInstance"; // adjust path as needed
import { socket } from "../../socket/socket";

// ─────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fmtPrice = (val) =>
  Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-gray-100 ${className}`} />
);

// ─────────────────────────────────────────────
// ConditionBadge
// ─────────────────────────────────────────────
const ConditionBadge = ({ type }) => {
  const isGt = type === "gt";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
        isGt
          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
          : "bg-rose-50 text-rose-500 border border-rose-100"
      }`}
    >
      {isGt ? "▲" : "▼"} {isGt ? "Above" : "Below"}
    </span>
  );
};

// ─────────────────────────────────────────────
// StatusBadge
// ─────────────────────────────────────────────
const StatusBadge = ({ triggered }) =>
  triggered ? (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
      Triggered
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-500 border border-sky-100">
      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block animate-pulse" />
      Active
    </span>
  );

// ─────────────────────────────────────────────
// DeleteButton
// ─────────────────────────────────────────────
const DeleteButton = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 text-gray-400 hover:text-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    title="Remove alert"
  >
    {loading ? (
      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
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
    ) : (
      <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
      </svg>
    )}
  </button>
);

// ─────────────────────────────────────────────
// AlertCard
// ─────────────────────────────────────────────
const AlertCard = ({ alert, onDelete, deleting }) => {
  const {
    _id,
    symbol,
    conditionType,
    targetPrice,
    isTriggered,
    triggeredAt,
    createdAt,
  } = alert;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md ${
        isTriggered
          ? "border-amber-100 shadow-sm"
          : "border-gray-100 shadow-sm hover:border-gray-200"
      }`}
    >
      {/* triggered ribbon */}
      {isTriggered && (
        <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-amber-400" />
      )}

      <div className="px-5 py-4 pl-6">
        {/* top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[15px] font-extrabold text-gray-800 tracking-tight">
              {symbol}
            </span>
            <ConditionBadge type={conditionType} />
            <StatusBadge triggered={isTriggered} />
          </div>
          <DeleteButton
            onClick={() => onDelete(_id)}
            loading={deleting === _id}
          />
        </div>

        {/* price */}
        <p className="text-2xl font-bold text-gray-900 mb-3">
          ₹{fmtPrice(targetPrice)}
        </p>

        {/* meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-gray-400">
            <svg
              className="w-3 h-3 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Created {fmtDate(createdAt)}</span>
          </div>
          {isTriggered && triggeredAt && (
            <div className="flex items-center gap-1.5 text-amber-500">
              <svg
                className="w-3 h-3 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span>Triggered {fmtDate(triggeredAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// AlertCardSkeleton
// ─────────────────────────────────────────────
const AlertCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-8 w-8 rounded-xl" />
    </div>
    <Skeleton className="h-7 w-28" />
    <Skeleton className="h-3 w-48" />
  </div>
);

// ─────────────────────────────────────────────
// StatsBar
// ─────────────────────────────────────────────
const StatsBar = ({ alerts }) => {
  if (!alerts?.length) return null;
  const triggered = alerts.filter((a) => a.isTriggered).length;
  const active = alerts.length - triggered;
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-sky-400" />
        <span className="text-xs font-semibold text-gray-600">
          {active} Active
        </span>
      </div>
      <div className="flex items-center gap-1.5 bg-white border border-amber-100 rounded-xl px-3 py-2 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-xs font-semibold text-gray-600">
          {triggered} Triggered
        </span>
      </div>
      <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm">
        <span className="text-xs font-semibold text-gray-400">
          Total {alerts.length}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
      <svg
        className="w-7 h-7 text-gray-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    </div>
    <p className="font-semibold text-gray-500 mb-1">No alerts set</p>
    <p className="text-sm text-gray-400 max-w-xs">
      Create price alerts to get notified when a stock hits your target.
    </p>
  </div>
);

// ─────────────────────────────────────────────
// ErrorState
// ─────────────────────────────────────────────
const ErrorState = ({ message, onRetry }) => (
  <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
    <p className="text-3xl mb-3">⚠️</p>
    <p className="text-red-500 font-semibold mb-1">Failed to load alerts</p>
    <p className="text-sm text-red-400 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
    >
      Retry
    </button>
  </div>
);

// ─────────────────────────────────────────────
// Toast notification
// ─────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold transition-all ${
        type === "success" ? "bg-gray-900 text-white" : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? (
        <svg
          className="w-4 h-4 text-emerald-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 text-red-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )}
      {message}
    </div>
  );
};

// ─────────────────────────────────────────────
// AlertsPage (root)
// ─────────────────────────────────────────────
const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null); // id of alert being deleted
  const [toast, setToast] = useState(null); // { message, type }
  const abortRef = useRef(null);

  // ── fetch ──
  const fetchAlerts = () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    axiosInstance
      .get("/alert", { signal: abortRef.current.signal })
      .then((res) => {
        if (res.data?.success) setAlerts(res.data.data ?? []);
        else setError("Failed to load alerts.");
      })
      .catch((err) => {
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED")
          return;
        setError(err?.response?.data?.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // ── delete ──
  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      const res = await axiosInstance.delete(`/alert/${id}`);
      if (res.data?.success) {
        setAlerts((prev) => prev.filter((a) => a._id !== id));
        setToast({ message: "Alert removed", type: "success" });
      } else {
        setToast({ message: "Failed to remove alert", type: "error" });
      }
    } catch (err) {
      setToast({
        message: err?.response?.data?.message || "Failed to remove alert",
        type: "error",
      });
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    socket.on("alert-triggered", (data) => {
     
      setAlerts((prev) =>
        prev.map((alertItem) => {
          if (alertItem._id === data.data.alertId) {
            return {
              ...alertItem,
              isTriggered: true,
              currentPrice: data.data.currentPrice,
              triggeredAt: data.data.triggeredAt,
            };
          } else {
            return alertItem;
          }
        }),
      );
    });
    return () => {
      socket.off("alert-triggered");
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 sm:px-6 py-6 pb-28">
      {/* ── Heading ── */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#44475b] tracking-tight">
          Price Alerts
        </h1>
        <p className="text-gray-400 mt-1.5 text-sm">
          Get notified when stocks hit your target price
        </p>
      </div>

      {/* ── Stats bar ── */}
      {!loading && !error && alerts.length > 0 && (
        <div className="mb-5">
          <StatsBar alerts={alerts} />
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <ErrorState message={error} onRetry={fetchAlerts} />
      )}

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <AlertCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && alerts.length === 0 && <EmptyState />}

      {/* ── Alert cards ── */}
      {!loading && !error && alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertCard
              key={alert._id}
              alert={alert}
              onDelete={handleDelete}
              deleting={deleting}
            />
          ))}
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AlertsPage;
