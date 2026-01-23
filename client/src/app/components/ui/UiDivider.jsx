"use client";

import React from "react";

export default function UiDivider({ className = "" }) {
  return (
    <hr className={["border-gray-200", className].filter(Boolean).join(" ")} />
  );
}
