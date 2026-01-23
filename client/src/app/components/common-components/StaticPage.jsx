import Link from "next/link";

export default function StaticPage({
  title,
  subtitle,
  children,
  backHref = "/",
}) {
  return (
    <section className="pt-28 px-3">
      <div className="container mx-auto pt-10 md:pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="nav-custom-shadow bg-white/95 backdrop-blur rounded-2xl border border-lightBrand/25 overflow-hidden">
            <div className="p-6 md:p-10">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bebas text-dark text-shadow-light">
                    {title}
                  </h1>
                  {subtitle ? (
                    <p className="font-jakarta text-gray-600 text-sm mt-1">
                      {subtitle}
                    </p>
                  ) : null}
                </div>

                <Link
                  href={backHref}
                  className="text-sm font-jakarta font-semibold text-dark/80 hover:text-brand"
                >
                  Back
                </Link>
              </div>

              <div className="prose prose-slate max-w-none font-jakarta">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
