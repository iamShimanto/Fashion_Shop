"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div
      className="h-28  md:h-32 bg-cover bg-center px-3 over flow-hidden  flex items-center"
      style={{ backgroundImage: "url('/breadcrumb.jpg')" }}
    >
      <div className="container flex items-center justify-between px-2   font-righteous">
        <nav
          aria-label="Breadcrumb"
          className="my-2  sm:my-3 lg:my-6 rounded-2xl"
        >
          <ol className="flex items-center justify-center space-x-2 text-xl px-5 py-1 md:py-1.5 border-2 bg-black/30 border-brand rounded-lg  b w-fit ">
            <li>
              <Link
                href="/"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bebas  mt-0.5 text-text text-glow hover:underline"
              >
                Home
              </Link>
            </li>

            {segments.map((segment, index) => {
              const href = "/" + segments.slice(0, index + 1).join("/");
              const isLast = index === segments.length - 1;

              return (
                <li key={href} className="text-xl flex items-center space-x-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl mb-3 text-lightBrand">
                    /
                  </span>
                  {isLast ? (
                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bebas text-text text-glow">
                      {decodeURIComponent(segment)}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="text-brand text-border hover:underline capitalize"
                    >
                      {decodeURIComponent(segment)}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
