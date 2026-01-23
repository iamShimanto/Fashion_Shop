"use client";

import React from "react";

export default function UiCard({
  children,
  className = "",
  padded = true,
  variant = "default",
}) {
  const variants = {
    default:
      "bg-white/95 backdrop-blur rounded-2xl border border-lightBrand/25 nav-custom-shadow",
    soft: "bg-gradient-to-br from-white via-white to-[#fff4e7] rounded-2xl border border-lightBrand/25",
    plain: "bg-white rounded-2xl border border-lightBrand/25",
  };

  return (
    <div
      className={[
        variants[variant] || variants.default,
        padded ? "p-6 md:p-10" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
