import React from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, loading, refresh, logout } = useAuth();

  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const mode = import.meta.env.MODE || "development";

  return (
    <div className="max-w-3xl space-y-4">
      <Card
        title="Settings"
        subtitle="Environment, session, and admin utilities."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={loading} onClick={refresh}>
              Refresh session
            </Button>
            <Button variant="outline" disabled={loading} onClick={logout}>
              Logout
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-dark/10 bg-white p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-dark/45">
              Admin Session
            </div>
            <div className="mt-2 text-sm text-dark/75 space-y-1">
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {loading ? "Checking…" : user ? "Signed in" : "Signed out"}
              </div>
              <div>
                <span className="font-semibold">Role:</span> {user?.role || "—"}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {user?.email || "—"}
              </div>
              <div>
                <span className="font-semibold">User ID:</span>{" "}
                {user?._id || "—"}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-dark/10 bg-white p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-dark/45">
              Environment
            </div>
            <div className="mt-2 text-sm text-dark/75 space-y-2">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-dark/45">
                  Mode
                </div>
                <div className="mt-1 rounded-lg border border-dark/10 bg-white px-3 py-2 font-mono text-xs">
                  {mode}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-dark/45">
                  API Base URL
                </div>
                <div className="mt-1 rounded-lg border border-dark/10 bg-white px-3 py-2 font-mono text-xs">
                  {apiBase}
                </div>
                <div className="mt-2 text-xs text-dark/55">
                  Requests use cookie auth (withCredentials).
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Notes" subtitle="Common setup checks">
        <ul className="list-disc pl-5 text-sm text-dark/75 space-y-1">
          <li>
            If admin can’t log in, confirm server CORS allows credentials and
            the cookie domain matches.
          </li>
          <li>
            For production, set{" "}
            <span className="font-semibold">VITE_API_BASE_URL</span> to your
            deployed API (ending with{" "}
            <span className="font-semibold">/api</span>).
          </li>
        </ul>
      </Card>
    </div>
  );
}
