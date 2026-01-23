"use client";

import React, { useEffect, useMemo, useState } from "react";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import SingleProduct from "../common-components/SingleProduct";
import { productApi } from "@/app/lib/productApi";
import toast from "react-hot-toast";

const CheckProducts = () => {
  const [gender, setGender] = useState("all");
  const [kind, setKind] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useMemo(
    () => ({
      page: 1,
      limit: 12,
      sort: kind === "bestSeller" ? "bestSeller" : "newest",
      gender: gender === "all" ? undefined : gender,
      onSale: kind === "onSale" ? true : undefined,
    }),
    [gender, kind],
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    productApi
      .list(params)
      .then((res) => {
        if (!alive) return;
        setItems(res?.data?.items || []);
      })
      .catch((err) => {
        if (!alive) return;
        toast.error(err?.message || "Failed to load products");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [params]);

  return (
    <section className="px-3 sm:px-6 lg:px-10 py-10">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2
            data-aos="fade-in"
            data-aos-duration="1200"
            className="text-6xl md:text-7xl text-dark lg:text-8xl font-bebas text-shadow-deep mt-10 mb-15 underline decoration-brand  decoration-4 lg:decoration-6 w-fit"
          >
            check our products
          </h2>

          <div className="flex items-center gap-2 mb-5 sm:mb-15">
            {["all", "men", "women"].map((key) => {
              const active = gender === key;
              const label =
                key === "all" ? "All" : key === "men" ? "Men" : "Women";

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setGender(key)}
                  className={
                    "px-4 py-2 rounded-lg border font-poppins text-sm transition-colors " +
                    (active
                      ? "bg-brand text-text border-brand"
                      : "bg-white text-dark border-gray-300 hover:border-brand")
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {[
            { key: "all", label: "All" },
            { key: "onSale", label: "On Sale" },
            { key: "bestSeller", label: "Best Seller" },
          ].map((x) => {
            const active = kind === x.key;
            return (
              <button
                key={x.key}
                type="button"
                onClick={() => setKind(x.key)}
                className={
                  "px-4 py-2 rounded-lg border font-poppins text-sm transition-colors " +
                  (active
                    ? "bg-brand text-text border-brand"
                    : "bg-white text-dark border-gray-300 hover:border-brand")
                }
              >
                {x.label}
              </button>
            );
          })}
        </div>

        <Splide
          extensions={{ AutoScroll }}
          options={{
            type: "loop",
            drag: "free",
            focus: "center",
            arrows: false,
            pagination: false,
            gap: "1.5rem",
            perPage: 5,
            autoScroll: {
              pauseOnHover: true,
              pauseOnFocus: false,
              rewind: false,
              speed: 1, // lower = slower continuous motion
            },
            breakpoints: {
              1536: { perPage: 5, gap: "1.25rem" },
              1280: { perPage: 4, gap: "1rem" },
              1024: { perPage: 3, gap: "0.75rem" },
              768: { perPage: 3, gap: "0.5rem" },
              640: { perPage: 2, gap: "0.5rem" },
            },
          }}
          aria-label="Our Products"
          className="pb-6"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <SplideSlide key={i}>
                  <div className="rounded-2xl w-full bg-gray-100 animate-pulse h-[280px] sm:h-[360px]" />
                </SplideSlide>
              ))
            : items.map((p) => (
                <SplideSlide key={p._id}>
                  <SingleProduct
                    image={p.images?.[0] || "/product-2.jpeg"}
                    title={p.title || "Product"}
                    price={Number(p.price || 0)}
                    slug={p.slug}
                  />
                </SplideSlide>
              ))}
        </Splide>
      </div>
    </section>
  );
};

export default CheckProducts;
