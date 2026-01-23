"use client";

import React from "react";
import Link from "next/link";

const VARIANTS = {
  brand: "bg-brand border-brand text-text",
  dark: "bg-dark border-dark text-text",
  light: "bg-white border-dark/20 text-dark",
};

const SIZES = {
  sm: "text-xl py-2 px-4",
  md: "text-2xl py-2 px-5",
  lg: "text-3xl py-2 px-6",
};

export default function UiLinkButton({
  href,
  children,
  variant = "brand",
  size = "lg",
  fullWidth = false,
  className = "",
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.brand;
  const sizeClass = SIZES[size] || SIZES.lg;

  return (
    <Link
      href={href}
      className={[
        fullWidth ? "w-full" : "inline-block",
        "text-center",
        variantClass,
        sizeClass,
        "font-bebas border-2 cardButtonHover text-glow font-medium transition hover:text-dark/90 cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Link>
  );
}
