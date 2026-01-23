import React from "react";

export default function Textarea({
  label,
  hint,
  error,
  className = "",
  textareaClassName = "",
  ...props
}) {
  return (
    <label className={"block " + className}>
      {label ? (
        <div className="mb-1 text-sm font-semibold text-dark/90">{label}</div>
      ) : null}
      <textarea
        {...props}
        className={
          "min-h-28 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25 " +
          (error ? "border-red-500" : "border-dark/15") +
          " " +
          textareaClassName
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
