import React from "react";

export default function Card({
  title,
  subtitle,
  actions,
  children,
  className = "",
}) {
  return (
    <section
      className={
        "rounded-2xl border border-dark/10 bg-white shadow-sm " + className
      }
    >
      {(title || subtitle || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dark/10 px-5 py-4">
          <div>
            {title ? (
              <h2 className="text-base font-bold text-dark">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="mt-0.5 text-sm text-dark/60">{subtitle}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex items-center gap-2">{actions}</div>
          ) : null}
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}
