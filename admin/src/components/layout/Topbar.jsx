import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);

  const onLogout = async () => {
    setBusy(true);
    try {
      await logout();
    } finally {
      setBusy(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-dark/10 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="md:hidden text-base font-extrabold text-dark">
          Admin <span className="text-brand">Panel</span>
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-bold text-dark leading-tight">
              {user?.fullName || "Admin"}
            </div>
            <div className="text-xs text-dark/50">{user?.email}</div>
          </div>
          <Button variant="outline" loading={busy} onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
