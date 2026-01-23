"use client";

import React from "react";

export default function UiSpinner({ className = "" }) {
  return (
    <div
      className={[
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Loading"
    />
  );
}
