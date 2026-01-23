import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import * as userApi from "../../lib/userApi";

function Badge({ variant, children }) {
  const cls =
    variant === "green"
      ? "bg-green-50 text-green-700 border-green-200"
      : variant === "red"
        ? "bg-red-50 text-red-700 border-red-200"
        : variant === "yellow"
          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
          : "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-xs font-bold ${cls}`}
    >
      {children}
    </span>
  );
}

export default function UsersList() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [verified, setVerified] = useState("");
  const [blocked, setBlocked] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const params = useMemo(() => {
    const p = { page, limit };
    if (q) p.q = q;
    if (role) p.role = role;
    if (verified) p.verified = verified;
    if (blocked) p.blocked = blocked;
    return p;
  }, [page, limit, q, role, verified, blocked]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await userApi.listAdmin(params);
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

  const onToggleBlocked = async (u) => {
    if (!u?._id) return;
    setBusyId(u._id);
    try {
      const next = !u.isBlocked;
      await userApi.updateAdmin(u._id, { isBlocked: next });
      toast.success(next ? "User blocked" : "User unblocked");
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
            Users
          </h1>
          <p className="mt-1 text-sm text-dark/60">
            Admin-only user management via{" "}
            <span className="font-semibold">/api/users/admin</span>.
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
            placeholder="Name, email, phone…"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
          />

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-dark/90">Role</div>
            <select
              className="w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
              value={role}
              onChange={(e) => {
                setPage(1);
                setRole(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-dark/90">
              Verified
            </div>
            <select
              className="w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
              value={verified}
              onChange={(e) => {
                setPage(1);
                setVerified(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Not verified</option>
            </select>
          </label>

          <label className="block">
            <div className="mb-1 text-sm font-semibold text-dark/90">
              Blocked
            </div>
            <select
              className="w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
              value={blocked}
              onChange={(e) => {
                setPage(1);
                setBlocked(e.target.value);
              }}
            >
              <option value="">All</option>
              <option value="true">Blocked</option>
              <option value="false">Active</option>
            </select>
          </label>
        </div>

        <div className="mt-3 text-xs text-dark/55">
          {meta ? (
            <>
              Total: <span className="font-semibold">{meta.total}</span>
            </>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-dark/70">
            <span className="text-xs font-bold uppercase tracking-wider text-dark/45">
              Per page
            </span>
            <select
              className="rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
              value={String(limit)}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </label>

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
        title="All Users"
        subtitle={meta ? `Page ${meta.page} of ${meta.pages}` : ""}
      >
        {loading ? (
          <div className="py-8 grid place-items-center">
            <Spinner label="Loading users…" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-sm text-dark/60">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-dark/10 text-xs uppercase tracking-wider text-dark/45">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Role</th>
                  <th className="py-2 pr-3">Verified</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Created</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u._id} className="border-b border-dark/5">
                    <td className="py-3 pr-3">
                      <div className="font-bold text-dark">{u.fullName}</div>
                      <div className="text-xs text-dark/55">
                        {u.phone || "—"}
                      </div>
                    </td>
                    <td className="py-3 pr-3">{u.email}</td>
                    <td className="py-3 pr-3">
                      <Badge variant={u.role === "admin" ? "yellow" : "gray"}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 pr-3">
                      <Badge variant={u.emailVerified ? "green" : "gray"}>
                        {u.emailVerified ? "verified" : "no"}
                      </Badge>
                    </td>
                    <td className="py-3 pr-3">
                      <Badge variant={u.isBlocked ? "red" : "green"}>
                        {u.isBlocked ? "blocked" : "active"}
                      </Badge>
                    </td>
                    <td className="py-3 pr-3">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/users/${u._id}`}>
                          <Button variant="outline">View</Button>
                        </Link>
                        <Button
                          variant={u.isBlocked ? "outline" : "danger"}
                          loading={busyId === u._id}
                          onClick={() => onToggleBlocked(u)}
                        >
                          {u.isBlocked ? "Unblock" : "Block"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
      </Card>
    </div>
  );
}
