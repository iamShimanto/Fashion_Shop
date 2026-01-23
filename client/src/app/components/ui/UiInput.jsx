"use client";

import React, { useMemo, useState } from "react";

const baseInputClass =
  "w-full px-4 py-3 border rounded-lg focus:shadow-xl focus:border-transparent focus:ring-2 focus:ring-brand focus:outline-none";

const UiInput = React.forwardRef(function UiInput(
  {
    label,
    helperText,
    error,
    className = "",
    inputClassName = "",
    type = "text",
    showToggle = false,
    as = "input",
    rows = 4,
    disabled = false,
    ...props
  },
  ref,
) {
  const [show, setShow] = useState(false);

  const finalType = useMemo(() => {
    if (type !== "password") return type;
    if (!showToggle) return "password";
    return show ? "text" : "password";
  }, [type, showToggle, show]);

  const fieldClass = [
    baseInputClass,
    error ? "border-red-300 ring-red-100" : "border-gray-200",
    disabled ? "bg-gray-50 text-gray-600" : "bg-white",
    inputClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const FieldTag = as;

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      {label && (
        <label className="block text-sm text-gray-700 mb-2 font-jakarta">
          {label}
        </label>
      )}

      <div className={type === "password" && showToggle ? "relative" : ""}>
        {FieldTag === "textarea" ? (
          <textarea
            ref={ref}
            rows={rows}
            disabled={disabled}
            className={fieldClass}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={finalType}
            disabled={disabled}
            className={fieldClass}
            {...props}
          />
        )}

        {type === "password" && showToggle && (
          <button
            type="button"
            onClick={() => setShow((p) => !p)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-dark text-sm"
          >
            {show ? "🙈" : "👁"}
          </button>
        )}
      </div>

      {(error || helperText) && (
        <p
          className={`mt-2 text-xs ${error ? "text-red-600" : "text-gray-500"}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default UiInput;
