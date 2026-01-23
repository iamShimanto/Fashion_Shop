import React from "react";
import Card from "../components/ui/Card";

export default function Settings() {
  return (
    <div className="max-w-2xl">
      <Card
        title="Settings"
        subtitle="Environment and preferences (expand later)."
      >
        <div className="text-sm text-dark/70 space-y-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-dark/45">
              API Base URL
            </div>
            <div className="mt-1 rounded-lg border border-dark/10 bg-white px-3 py-2 font-mono text-xs">
              {import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
