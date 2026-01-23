import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import * as productApi from "../../lib/productApi";

export default function ProductsList() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const params = useMemo(() => {
    const p = { limit: 20 };
    if (q) p.q = q;
    if (status) p.status = status;
    return p;
  }, [q, status]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await productApi.listAdmin(params);
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

  const onDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    setBusyId(id);
    try {
      await productApi.deleteProduct(id);
      toast.success("Deleted");
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">
            Products
          </h1>
          <p className="mt-1 text-sm text-dark/60">
            Admin-only CRUD via{" "}
            <span className="font-semibold">/api/products</span>.
          </p>
        </div>
        <Link to="/products/new">
          <Button>Create product</Button>
        </Link>
      </div>

      <Card
        title="Filters"
        actions={
          <Button variant="outline" onClick={load}>
            Refresh
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            label="Search"
            placeholder="Title, vendor, tag…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <label className="block">
            <div className="mb-1 text-sm font-semibold text-dark/90">
              Status
            </div>
            <select
              className="w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <div className="flex items-end">
            <div className="text-xs text-dark/55">
              {meta ? (
                <>
                  Total: <span className="font-semibold">{meta.total}</span>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card title="All Products">
        {loading ? (
          <div className="py-8 grid place-items-center">
            <Spinner label="Loading products…" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-sm text-dark/60">
            No products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-dark/10 text-xs uppercase tracking-wider text-dark/45">
                  <th className="py-2 pr-3">Title</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Price</th>
                  <th className="py-2 pr-3">Stock</th>
                  <th className="py-2 pr-3">Updated</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id} className="border-b border-dark/5">
                    <td className="py-3 pr-3">
                      <div className="font-bold text-dark">{p.title}</div>
                      <div className="text-xs text-dark/55">/{p.slug}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={
                          "inline-flex rounded-full px-2 py-1 text-xs font-bold " +
                          (p.status === "active"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : p.status === "draft"
                              ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                              : "bg-gray-50 text-gray-700 border border-gray-200")
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 pr-3">{p.price}</td>
                    <td className="py-3 pr-3">
                      {p.inventory?.track ? (p.inventory?.quantity ?? 0) : "—"}
                    </td>
                    <td className="py-3 pr-3">
                      {p.updatedAt
                        ? new Date(p.updatedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/products/${p._id}`}>
                          <Button variant="outline">Edit</Button>
                        </Link>
                        <Button
                          variant="danger"
                          loading={busyId === p._id}
                          onClick={() => onDelete(p._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
