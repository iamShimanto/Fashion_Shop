"use client";

import { orderApi } from "@/app/lib/orderApi";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function money(n, currency) {
  const v = Number(n || 0);
  return `${v.toFixed(2)} ${currency || ""}`.trim();
}

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await orderApi.myById(id);
        if (!cancelled) setOrder(res?.data || null);
      } catch (e) {
        toast.error(e?.message || "Failed to load order");
        router.push("/account");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  return (
    <section className="pt-28 px-3 pb-16">
      

      <div className="container mx-auto pt-10">
        <div className="max-w-4xl mx-auto rounded-2xl border border-lightBrand/25 bg-white p-5 md:p-6 nav-custom-shadow">
          <div className="flex items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-bebas text-dark text-shadow-light">
                Order Details
              </h2>
              <p className="font-jakarta text-gray-600">
                <Link className="text-brand hover:underline" href="/account">
                  Back to Account
                </Link>
              </p>
            </div>
          </div>

          {loading ? (
            <p className="font-jakarta text-gray-600">Loading...</p>
          ) : !order ? (
            <p className="font-jakarta text-gray-600">Order not found.</p>
          ) : (
            <div className="space-y-6 font-jakarta">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="text-xs uppercase tracking-wider text-gray-500">
                    Order
                  </div>
                  <div className="text-lg font-semibold text-dark">
                    {order.orderNumber || order._id}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "—"}
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="text-xs uppercase tracking-wider text-gray-500">
                    Status
                  </div>
                  <div className="text-lg font-semibold text-dark">
                    {order.status || "—"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Payment: {order.paymentStatus || "—"}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  Totals
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Subtotal</div>
                    <div className="font-semibold text-dark">
                      {money(order.subtotal, order.currency)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Discount</div>
                    <div className="font-semibold text-dark">
                      {money(order.discount, order.currency)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Shipping</div>
                    <div className="font-semibold text-dark">
                      {money(order.shippingCost, order.currency)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="font-semibold text-dark">
                      {money(order.total, order.currency)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  Items ({order.items?.length ?? 0})
                </div>

                {order.items?.length ? (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b text-xs uppercase tracking-wider text-gray-500">
                          <th className="py-2 pr-3">Product</th>
                          <th className="py-2 pr-3">Qty</th>
                          <th className="py-2 pr-3">Unit</th>
                          <th className="py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((it, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="py-3 pr-3">
                              <div className="font-semibold text-dark">
                                {it.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {it.size ? `Size: ${it.size}` : ""}
                                {it.size && it.color?.name ? " • " : ""}
                                {it.color?.name ? `Color: ${it.color.name}` : ""}
                              </div>
                            </td>
                            <td className="py-3 pr-3">{it.quantity}</td>
                            <td className="py-3 pr-3">{money(it.unitPrice, order.currency)}</td>
                            <td className="py-3 font-semibold text-dark">
                              {money((it.unitPrice || 0) * (it.quantity || 0), order.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-600">No items.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
