import React from "react";

export default function Input({
  label,
  hint,
  error,
  className = "",
  inputClassName = "",
  ...props
}) {
  return (
    <label className={"block " + className}>
      {label ? (
        <div className="mb-1 text-sm font-semibold text-dark/90">{label}</div>
      ) : null}
      <input
        {...props}
        className={
          "w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25 " +
          (error ? "border-red-500" : "border-dark/15") +
          " " +
          inputClassName
        }
      />
      {error ? (
        <div className="mt-1 text-xs font-medium text-red-600">{error}</div>
      ) : hint ? (
        <div className="mt-1 text-xs text-dark/60">{hint}</div>
      ) : null}
    </label>
  );
}
