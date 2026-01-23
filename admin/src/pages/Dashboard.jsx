import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import * as productApi from "../lib/productApi";
import * as orderApi from "../lib/orderApi";
import * as userApi from "../lib/userApi";

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

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: null,
    activeProducts: null,
    totalUsers: null,
    totalOrders: null,
    pendingOrders: null,
    deliveredOrders: null,
    ordersToday: null,
    revenueToday: null,
    revenueDeliveredTotal: null,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const money = (n) => {
    if (n === null || n === undefined) return "—";
    const v = Number(n);
    if (Number.isNaN(v)) return "—";
    return v.toFixed(2);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [
        allProductsRes,
        activeProductsRes,
        usersRes,
        analyticsRes,
        recentRes,
      ] = await Promise.all([
        productApi.listAdmin({ limit: 1 }),
        productApi.listAdmin({ limit: 1, status: "active" }),
        userApi.listAdmin({ limit: 1 }),
        orderApi.analytics(),
        orderApi.listAdmin({ page: 1, limit: 5 }),
      ]);

      const allTotal = allProductsRes?.data?.meta?.total ?? null;
      const activeTotal = activeProductsRes?.data?.meta?.total ?? null;
      const usersTotal = usersRes?.data?.meta?.total ?? null;
      const totalsOrders = analyticsRes?.data?.totals?.orders ?? null;
      const byStatus = analyticsRes?.data?.byStatus || {};
      const todayOrders = analyticsRes?.data?.today?.orders ?? null;
      const todayRevenue =
        analyticsRes?.data?.today?.revenueDelivered ??
        analyticsRes?.data?.today?.revenue ??
        null;
      const deliveredTotal =
        analyticsRes?.data?.totals?.revenueDelivered ??
        analyticsRes?.data?.totals?.revenue ??
        null;

      setRecentOrders(recentRes?.data?.items || []);

      setStats({
        totalProducts: allTotal,
        activeProducts: activeTotal,
        totalUsers: usersTotal,
        totalOrders: totalsOrders,
        pendingOrders: byStatus?.pending ?? null,
        deliveredOrders: byStatus?.delivered ?? null,
        ordersToday: todayOrders,
        revenueToday: todayRevenue,
        revenueDeliveredTotal: deliveredTotal,
      });
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-dark/60">
            Quick overview of products and orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/products">
            <Button>Manage Products</Button>
          </Link>
          <Link to="/products/new">
            <Button variant="outline">Add Product</Button>
          </Link>
          <Link to="/orders">
            <Button variant="outline">View Orders</Button>
          </Link>
          <Link to="/users">
            <Button variant="outline">Users</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-10 grid place-items-center">
          <Spinner label="Loading dashboard…" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Total Products"
            value={stats.totalProducts ?? "—"}
            sub="From /products/admin"
          />
          <Stat label="Active Products" value={stats.activeProducts ?? "—"} />
          <Stat label="Total Users" value={stats.totalUsers ?? "—"} />
          <Stat label="Total Orders" value={stats.totalOrders ?? "—"} />
          <Stat
            label="Orders Today"
            value={stats.ordersToday ?? "—"}
            sub="From /orders/admin/analytics"
          />
          <Stat
            label="Revenue Today"
            value={money(stats.revenueToday)}
            sub="Recognized when delivered"
          />
          <Stat label="Pending Orders" value={stats.pendingOrders ?? "—"} />
          <Stat label="Delivered Orders" value={stats.deliveredOrders ?? "—"} />
          <Stat
            label="Total Revenue (Delivered)"
            value={money(stats.revenueDeliveredTotal)}
            sub="All-time delivered revenue"
          />
        </div>
      )}

      <Card title="Recent Orders" subtitle="Last 5 orders (admin list)">
        {loading ? (
          <div className="py-8 grid place-items-center">
            <Spinner label="Loading…" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-6 text-center text-sm text-dark/60">
            No recent orders.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-dark/10 text-xs uppercase tracking-wider text-dark/45">
                  <th className="py-2 pr-3">Order</th>
                  <th className="py-2 pr-3">Customer</th>
                  <th className="py-2 pr-3">Total</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Created</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => {
                  const name = [
                    o?.shippingAddress?.firstName,
                    o?.shippingAddress?.lastName,
                  ]
                    .filter(Boolean)
                    .join(" ");
                  const email = o?.shippingAddress?.email;

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
                          {email || "—"}
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        {o.total ?? 0} {o.currency || ""}
                      </td>
                      <td className="py-3 pr-3">
                        <span className="text-xs font-semibold text-dark/80">
                          {o.status || "—"}
                        </span>
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

      <Card
        title="Next Steps"
        subtitle="This admin is wired for cookie auth + your order/product routes."
      >
        <ul className="list-disc pl-5 text-sm text-dark/75 space-y-1">
          <li>Products CRUD uses your role-protected endpoints.</li>
          <li>Orders list + detail use /api/orders/admin endpoints.</li>
          <li>Analytics uses /api/orders/admin/analytics.</li>
          <li>Set VITE_API_BASE_URL in admin env for production.</li>
        </ul>
      </Card>
    </div>
  );
}
