import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#fffcfc] text-dark">
      <div className="flex min-h-screen">
        <Sidebar variant="desktop" />

        {/* Mobile overlay sidebar */}
        <div className={mobileOpen ? "md:hidden" : "hidden"}>
          <div
            className="fixed inset-0 z-30 bg-black/35 backdrop-blur-[1px]"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />
          <Sidebar
            variant="mobile"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            isMenuOpen={mobileOpen}
            onOpenMenu={() => setMobileOpen(true)}
          />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
            <Outlet />
          </main>
          <footer className="border-t border-dark/10 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-dark/55">
              © {new Date().getFullYear()} Fashion Admin
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
