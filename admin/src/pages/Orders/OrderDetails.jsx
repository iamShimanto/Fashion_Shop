import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import * as orderApi from "../../lib/orderApi";

function formatMoney(value, currency) {
  const n = Number(value || 0);
  const c = currency || "USD";
  return `${n.toFixed(2)} ${c}`;
}

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [transactionId, setTransactionId] = useState("");

  const customerName = useMemo(() => {
    const a = order?.shippingAddress;
    return [a?.firstName, a?.lastName].filter(Boolean).join(" ");
  }, [order]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAdminById(id);
      const data = res?.data;
      setOrder(data);
      setStatus(data?.status || "pending");
      setPaymentStatus(data?.paymentStatus || "pending");
      setTransactionId(data?.transactionId || "");
    } catch (e) {
      toast.error(e.message);
      navigate("/orders", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await orderApi.updateAdmin(id, {
        status,
        paymentStatus,
        transactionId,
      });
      const updated = res?.data;
      setOrder(updated);
      toast.success("Order updated");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 grid place-items-center">
        <Spinner label="Loading order…" />
      </div>
    );
  }

  if (!order) return null;

  const a = order.shippingAddress || {};

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">
            Order {order.orderNumber || ""}
          </h1>
          <p className="mt-1 text-sm text-dark/60">
            Created{" "}
            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
          <Button loading={saving} onClick={onSave}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card title="Summary">
          <div className="text-sm text-dark/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-dark/55">Total</span>
              <span className="font-extrabold text-dark">
                {formatMoney(order.total, order.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark/55">Subtotal</span>
              <span className="font-semibold text-dark">
                {formatMoney(order.subtotal, order.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark/55">Discount</span>
              <span className="font-semibold text-dark">
                {formatMoney(order.discount, order.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dark/55">Shipping</span>
              <span className="font-semibold text-dark">
                {formatMoney(order.shippingCost, order.currency)}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Customer">
          <div className="text-sm text-dark/80 space-y-1">
            <div className="font-bold text-dark">{customerName || "—"}</div>
            <div className="text-dark/65">{a.email || "—"}</div>
            <div className="text-dark/65">{a.phone || "—"}</div>
            <div className="pt-2 text-xs text-dark/55">
              {a.street ? (
                <>
                  {a.street}, {a.city} {a.state} {a.postalCode}, {a.country}
                </>
              ) : (
                "—"
              )}
            </div>
          </div>
        </Card>

        <Card title="Update">
          <div className="grid grid-cols-1 gap-3">
            <label className="block">
              <div className="mb-1 text-sm font-semibold text-dark/90">
                Status
              </div>
              <select
                className="w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
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
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </label>

            <Input
              label="Transaction ID"
              placeholder="Optional"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />

            <Button loading={saving} onClick={onSave}>
              Save
            </Button>
          </div>
        </Card>
      </div>

      <Card title="Items" subtitle={`${order.items?.length ?? 0} item(s)`}>
        {order.items?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-dark/10 text-xs uppercase tracking-wider text-dark/45">
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2 pr-3">Options</th>
                  <th className="py-2 pr-3">Qty</th>
                  <th className="py-2 pr-3">Unit</th>
                  <th className="py-2">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it, idx) => (
                  <tr key={idx} className="border-b border-dark/5">
                    <td className="py-3 pr-3">
                      <div className="font-bold text-dark">{it.title}</div>
                      <div className="text-xs text-dark/55">
                        /{it.slug || ""}
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="text-xs text-dark/65">
                        {it.size ? `Size: ${it.size}` : "—"}
                        {it.color?.name ? ` • Color: ${it.color.name}` : ""}
                      </div>
                    </td>
                    <td className="py-3 pr-3">{it.quantity}</td>
                    <td className="py-3 pr-3">
                      {formatMoney(it.unitPrice, order.currency)}
                    </td>
                    <td className="py-3 font-semibold text-dark">
                      {formatMoney(
                        (it.unitPrice || 0) * (it.quantity || 0),
                        order.currency,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-dark/60">No items.</div>
        )}
      </Card>

      {order.note ? (
        <Card title="Note">
          <div className="text-sm text-dark/70 whitespace-pre-wrap">
            {order.note}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
