"use client";

import React from "react";

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

export default function UiButton({
  children,
  variant = "brand",
  size = "lg",
  type = "button",
  loading = false,
  loadingText = "Please wait...",
  disabled = false,
  fullWidth = false,
  className = "",
  ...props
}) {
  const isDisabled = disabled || loading;

  const variantClass = VARIANTS[variant] || VARIANTS.brand;
  const sizeClass = SIZES[size] || SIZES.lg;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        fullWidth ? "w-full" : "",
        variantClass,
        sizeClass,
        "font-bebas border-2 cardButtonHover text-glow font-medium transition",
        isDisabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:text-dark/90 cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? loadingText : children}
    </button>
  );
}
