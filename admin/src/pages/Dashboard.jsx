import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

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
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-dark/60">
            Quick overview (orders & analytics coming soon).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/products">
            <Button>Manage Products</Button>
          </Link>
          <Button variant="outline" disabled>
            View Orders (soon)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Products"
          value="—"
          sub="Connects to /products/admin"
        />
        <Stat label="Active Products" value="—" />
        <Stat label="Orders Today" value="—" sub="Planned" />
        <Stat label="Revenue" value="—" sub="Planned" />
      </div>

      <Card
        title="Next Steps"
        subtitle="This admin is wired for cookie auth + your product routes."
      >
        <ul className="list-disc pl-5 text-sm text-dark/75 space-y-1">
          <li>Products CRUD uses your role-protected endpoints.</li>
          <li>Orders + analytics pages are placeholders for future routes.</li>
          <li>Set VITE_API_BASE_URL in admin env for production.</li>
        </ul>
      </Card>
    </div>
  );
}
