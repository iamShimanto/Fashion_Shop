import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import * as userApi from "../../lib/userApi";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  const [role, setRole] = useState("user");
  const [emailVerified, setEmailVerified] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAdminById(id);
      const data = res?.data;
      setUser(data);
      setRole(data?.role || "user");
      setEmailVerified(Boolean(data?.emailVerified));
      setIsBlocked(Boolean(data?.isBlocked));
    } catch (e) {
      toast.error(e.message);
      navigate("/users", { replace: true });
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
      const res = await userApi.updateAdmin(id, {
        role,
        emailVerified,
        isBlocked,
      });
      setUser(res?.data || null);
      toast.success("User updated");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setSaving(true);
    try {
      await userApi.deleteAdmin(id);
      toast.success("User deleted");
      navigate("/users", { replace: true });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 grid place-items-center">
        <Spinner label="Loading user…" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">
            User
          </h1>
          <p className="mt-1 text-sm text-dark/60">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/users">
            <Button variant="outline">Back</Button>
          </Link>
          <Button loading={saving} onClick={onSave}>
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card title="Profile">
          <div className="space-y-2 text-sm text-dark/80">
            <div>
              <div className="text-xs uppercase tracking-wider text-dark/45">
                Name
              </div>
              <div className="font-bold text-dark">{user.fullName}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-dark/45">
                Phone
              </div>
              <div>{user.phone || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-dark/45">
                Created
              </div>
              <div>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : "—"}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Access">
          <div className="grid grid-cols-1 gap-3">
            <label className="block">
              <div className="mb-1 text-sm font-semibold text-dark/90">
                Role
              </div>
              <select
                className="w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={emailVerified}
                onChange={(e) => setEmailVerified(e.target.checked)}
              />
              Email verified
            </label>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isBlocked}
                onChange={(e) => setIsBlocked(e.target.checked)}
              />
              Blocked
            </label>
          </div>
        </Card>

        <Card title="Danger Zone" subtitle="Deleting is permanent">
          <div className="space-y-3">
            <Input label="User ID" value={user._id} readOnly />
            <Button variant="danger" loading={saving} onClick={onDelete}>
              Delete User
            </Button>
            <div className="text-xs text-dark/55">
              Admin users cannot be deleted by this endpoint.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
