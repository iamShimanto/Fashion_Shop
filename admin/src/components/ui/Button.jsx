import React from "react";

const variants = {
  brand:
    "bg-brand border-brand text-white hover:bg-lightBrand hover:border-lightBrand",
  outline:
    "bg-white border-dark/20 text-dark hover:border-brand hover:text-brand",
  ghost: "bg-transparent border-transparent text-dark hover:bg-dark/5",
  danger:
    "bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700",
};

export default function Button({
  children,
  variant = "brand",
  type = "button",
  loading = false,
  disabled,
  className = "",
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={
        "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand/40 " +
        variants[variant] +
        " " +
        (isDisabled ? "opacity-60 cursor-not-allowed" : "") +
        " " +
        className
      }
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          <span>Loading…</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
