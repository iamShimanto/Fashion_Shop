import React from "react";
import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition " +
  (isActive
    ? "bg-brand text-white"
    : "text-dark/80 hover:bg-dark/5 hover:text-dark");

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 shrink-0 border-r border-dark/10 bg-white">
      <div className="px-5 py-5">
        <Link to="/" className="block">
          <div className="text-lg font-extrabold tracking-tight text-dark">
            Fashion <span className="text-brand">Admin</span>
          </div>
          <div className="text-xs text-dark/55">Manage products & orders</div>
        </Link>
      </div>

      <nav className="px-3 pb-5">
        <div className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-dark/40">
          Main
        </div>
        <div className="space-y-1">
          <NavLink to="/" end className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/orders" className={navLinkClass}>
            Orders
          </NavLink>
          <NavLink to="/analytics" className={navLinkClass}>
            Analytics
          </NavLink>
        </div>

        <div className="mt-6 px-2 pb-2 text-xs font-bold uppercase tracking-wider text-dark/40">
          Settings
        </div>
        <div className="space-y-1">
          <NavLink to="/settings" className={navLinkClass}>
            Settings
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
