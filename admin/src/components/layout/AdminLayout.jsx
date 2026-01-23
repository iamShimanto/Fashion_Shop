import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#fffcfc] text-dark">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
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
