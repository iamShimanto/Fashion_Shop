"use client";

import React from "react";

export default function UiBadge({ children, tone = "brand", className = "" }) {
  const tones = {
    brand: "bg-orange-50 text-orange-700 border-orange-200",
    success: "bg-green-50 text-green-700 border-green-200",
    dark: "bg-gray-900 text-white border-gray-900",
    neutral: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={[
        "text-xs font-semibold px-2 py-1 rounded-full border",
        tones[tone] || tones.brand,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
