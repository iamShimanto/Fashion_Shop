"use client";

import React from "react";

export default function UiSection({ children, className = "" }) {
  return (
    <section className={["pt-28 px-3", className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}
