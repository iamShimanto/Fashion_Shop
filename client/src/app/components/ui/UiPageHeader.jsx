"use client";

import React from "react";

export default function UiPageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-3xl md:text-5xl font-bebas text-dark text-shadow-light">
          {title}
        </h2>
        {subtitle && <p className="font-jakarta text-gray-600">{subtitle}</p>}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
