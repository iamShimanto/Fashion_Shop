import React from "react";
import Card from "../components/ui/Card";

export default function ComingSoon({ title, description }) {
  return (
    <div className="max-w-2xl">
      <Card title={title} subtitle={description}>
        <div className="rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-dark/75">
          This section is intentionally scaffolded for future features.
        </div>
      </Card>
    </div>
  );
}
