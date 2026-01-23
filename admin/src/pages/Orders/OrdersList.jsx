import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import * as orderApi from "../../lib/orderApi";

function Badge({ variant, children }) {
  const cls =
    variant === "green"
      ? "bg-green-50 text-green-700 border-green-200"
      : variant === "blue"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : variant === "yellow"
          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
          : variant === "red"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span
      className={
        "inline-flex rounded-full border px-2 py-1 text-xs font-bold " + cls
      }
    >
      {children}
    </span>
  );
}

function statusVariant(status) {
  switch (status) {
    case "pending":
      return "yellow";
    case "confirmed":
      return "blue";
    case "shipped":
      return "blue";
    case "delivered":
      return "green";
    case "cancelled":
      return "red";
    default:
      return "gray";
  }
}

function paymentVariant(status) {
  switch (status) {
    case "paid":
      return "green";
    case "pending":
      return "yellow";
    case "failed":
      return "red";
    case "refunded":
      return "gray";
    default:
      return "gray";
  }
}

export default function OrdersList() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useMemo(() => {
    const p = { page, limit };
    if (q) p.q = q;
    if (status) p.status = status;
    if (paymentStatus) p.paymentStatus = paymentStatus;
    return p;
  }, [page, limit, q, status, paymentStatus]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await orderApi.listAdmin(params);
      const data = res?.data;
      setItems(data?.items || []);
      setMeta(data?.meta || null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const canPrev = page > 1;
  const canNext = meta ? page < meta.pages : false;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">
            Orders
          </h1>
          <p className="mt-1 text-sm text-dark/60">
            Admin order management via{" "}
            <span className="font-semibold">/api/orders</span>.
          </p>
        </div>
        <Button variant="outline" onClick={load}>
          Refresh
        </Button>
      </div>
      <Card title="Filters">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <Input
            label="Search"
            placeholder="Order number, email, phone…"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
          />

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-dark/90">
              Status
            </div>
            <select
              className="w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-dark/90">
              Payment Status
            </div>
            <select
              className="w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
              value={paymentStatus}
              onChange={(e) => {
                setPage(1);
                setPaymentStatus(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-dark/90">
              Per page
            </div>
            <select
              className="w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
              value={String(limit)}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-dark/55">
            {meta ? (
              <>
                Total: <span className="font-semibold">{meta.total}</span>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={!canPrev}
              onClick={() => canPrev && setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <div className="text-sm text-dark/70">
              Page <span className="font-semibold">{meta?.page || page}</span>
              {meta?.pages ? (
                <>
                  {" "}
                  of <span className="font-semibold">{meta.pages}</span>
                </>
              ) : null}
            </div>
            <Button
              variant="outline"
              disabled={!canNext}
              onClick={() => canNext && setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <Card
        title="All Orders"
        subtitle={meta ? `Page ${meta.page} of ${meta.pages}` : ""}
      >
        {loading ? (
          <div className="py-8 grid place-items-center">
            <Spinner label="Loading orders…" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-sm text-dark/60">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-dark/10 text-xs uppercase tracking-wider text-dark/45">
                  <th className="py-2 pr-3">Order</th>
                  <th className="py-2 pr-3">Customer</th>
                  <th className="py-2 pr-3">Items</th>
                  <th className="py-2 pr-3">Total</th>
                  <th className="py-2 pr-3">Payment</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Created</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((o) => {
                  const name = [
                    o?.shippingAddress?.firstName,
                    o?.shippingAddress?.lastName,
                  ]
                    .filter(Boolean)
                    .join(" ");
                  const email = o?.shippingAddress?.email || "";
                  const phone = o?.shippingAddress?.phone || "";

                  return (
                    <tr key={o._id} className="border-b border-dark/5">
                      <td className="py-3 pr-3">
                        <div className="font-extrabold text-dark">
                          {o.orderNumber || o._id}
                        </div>
                        <div className="text-xs text-dark/55">
                          {o.paymentMethod
                            ? o.paymentMethod.toUpperCase()
                            : "—"}
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="font-semibold text-dark">
                          {name || "—"}
                        </div>
                        <div className="text-xs text-dark/55">
                          {email || phone ? (
                            <>
                              {email ? email : ""}
                              {email && phone ? " • " : ""}
                              {phone ? phone : ""}
                            </>
                          ) : (
                            "—"
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-3">{o.items?.length ?? 0}</td>
                      <td className="py-3 pr-3">
                        {o.total ?? 0} {o.currency || ""}
                      </td>
                      <td className="py-3 pr-3">
                        <Badge variant={paymentVariant(o.paymentStatus)}>
                          {o.paymentStatus || "—"}
                        </Badge>
                      </td>
                      <td className="py-3 pr-3">
                        <Badge variant={statusVariant(o.status)}>
                          {o.status || "—"}
                        </Badge>
                      </td>
                      <td className="py-3 pr-3">
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="py-3">
                        <Link to={`/orders/${o._id}`}>
                          <Button variant="outline">View</Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {meta?.pages ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-dark/55">
            Showing {items.length} of {meta.total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={!canPrev}
              onClick={() => canPrev && setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              disabled={!canNext}
              onClick={() => canNext && setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
