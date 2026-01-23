import React from "react";

export default function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center gap-3 text-dark/80">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-dark/20 border-t-brand" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
