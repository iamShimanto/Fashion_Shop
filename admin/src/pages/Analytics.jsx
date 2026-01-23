import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import * as orderApi from "../lib/orderApi";

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-dark/10 bg-white px-4 py-4 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wider text-dark/45">
        {label}
      </div>
      <div className="mt-1 text-2xl font-extrabold text-dark">{value}</div>
      {sub ? <div className="mt-1 text-xs text-dark/55">{sub}</div> : null}
    </div>
  );
}

function money(n) {
  const v = Number(n || 0);
  return v.toFixed(2);
}

function StatusBars({ byStatus = {} }) {
  const keys = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  const max = Math.max(1, ...keys.map((k) => Number(byStatus?.[k] || 0)));

  return (
    <div className="space-y-3">
      {keys.map((k) => {
        const count = Number(byStatus?.[k] || 0);
        const pct = Math.round((count / max) * 100);
        return (
          <div key={k} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="font-semibold text-dark/80">{k}</div>
              <div className="text-dark/55">{count}</div>
            </div>
            <div className="h-2 w-full rounded-full bg-dark/5 overflow-hidden">
              <div
                className="h-2 rounded-full bg-brand"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RevenueLine({ series = [] }) {
  const points = Array.isArray(series) ? series : [];
  const values = points.map((p) => Number(p?.revenue || 0));
  const max = Math.max(1, ...values);
  const w = 560;
  const h = 140;
  const pad = 14;

  const d = points
    .map((p, idx) => {
      const x = pad + (idx * (w - pad * 2)) / Math.max(1, points.length - 1);
      const y = h - pad - (Number(p?.revenue || 0) / max) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="text-sm font-semibold text-dark">
          Delivered revenue (last 7 days)
        </div>
        <div className="text-xs text-dark/55">Max: {money(max)}</div>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-36 rounded-xl border border-dark/10 bg-white"
        role="img"
        aria-label="Delivered revenue last 7 days"
      >
        <polyline
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="2"
          points={`${pad},${h - pad} ${w - pad},${h - pad}`}
        />
        <polyline
          fill="none"
          stroke="rgb(241, 84, 25)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={d}
        />
      </svg>

      <div className="mt-2 grid grid-cols-7 gap-1 text-[11px] text-dark/55">
        {points.map((p) => (
          <div key={p.date} className="text-center">
            {String(p.date || "").slice(5)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await orderApi.analytics();
      setData(res?.data || null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-dark/60">
            Order totals from{" "}
            <span className="font-semibold">/api/orders/admin/analytics</span>.
          </p>
        </div>
        <button
          onClick={load}
          className="text-sm font-semibold text-brand hover:underline"
        >
          Refresh
        </button>
      </div>

      <Card title="Overview">
        {loading ? (
          <div className="py-8 grid place-items-center">
            <Spinner label="Loading analytics…" />
          </div>
        ) : !data ? (
          <div className="py-6 text-center text-sm text-dark/60">
            No analytics available.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total Orders" value={data?.totals?.orders ?? 0} />
            <Stat
              label="Total Revenue (Delivered)"
              value={money(
                data?.totals?.revenueDelivered ?? data?.totals?.revenue,
              )}
              sub="Recognized when order is delivered"
            />
            <Stat label="Today Orders" value={data?.today?.orders ?? 0} />
            <Stat
              label="Today Revenue (Delivered)"
              value={money(
                data?.today?.revenueDelivered ?? data?.today?.revenue,
              )}
              sub="Delivered today (by status update)"
            />
          </div>
        )}
      </Card>

      {!loading && data ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card
            title="Revenue Chart"
            subtitle="Delivered revenue over the last 7 days"
          >
            <RevenueLine series={data?.deliveredRevenueLast7Days || []} />
            <div className="mt-3 text-xs text-dark/55">
              Gross totals (all statuses): {money(data?.totals?.revenueAll)} •
              Today gross: {money(data?.today?.revenueAll)}
            </div>
          </Card>

          <Card title="Status Chart" subtitle="Orders grouped by status">
            <StatusBars byStatus={data?.byStatus || {}} />
          </Card>
        </div>
      ) : null}

      <Card title="By Status" subtitle="Counts by order.status">
        {loading ? (
          <div className="py-6 grid place-items-center">
            <Spinner label="Loading…" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(
              (s) => (
                <Stat key={s} label={s} value={data?.byStatus?.[s] ?? 0} />
              ),
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
