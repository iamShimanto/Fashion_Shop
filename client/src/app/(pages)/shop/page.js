"use client";

import BrandButton from "@/app/components/common-components/BrandButton";
import Breadcrumb from "@/app/components/common-components/Breadcrumb";
import SingleProduct from "@/app/components/common-components/SingleProduct";
import { productApi } from "@/app/lib/productApi";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const ShopPage = () => {
  const [limit, setLimit] = useState(20);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const params = useMemo(
    () => ({ page, limit, sort, q: q.trim() || undefined }),
    [page, limit, sort, q],
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);

    productApi
      .list(params)
      .then((res) => {
        if (!alive) return;
        setItems(res?.data?.items || []);
        setMeta(res?.data?.meta || { page: 1, pages: 1, total: 0 });
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

  const canPrev = page > 1;
  const canNext = page < (meta?.pages || 1);

  return (
    <>
      <section className="min-h-screen px-3 pt-28">
        <Breadcrumb />

        <div className="container pt-10 overflow-hidden pb-20">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <div className="flex-1">
              <input
                value={q}
                onChange={(e) => {
                  setPage(1);
                  setQ(e.target.value);
                }}
                placeholder="Search products..."
                className="w-full md:max-w-[420px] px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand font-poppins"
              />
            </div>

            <div className="flex items-center gap-4">
              <select
                value={String(limit)}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
                className="w-[120px] cursor-pointer p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand font-poppins"
              >
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="35">35</option>
                <option value="40">40</option>
              </select>

              <select
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value);
                }}
                className="w-[180px] cursor-pointer p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand font-poppins"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div
            data-aos="fade-in"
            className="[@media(min-width:320px)]:px-0 [@media(min-width:450px)]:px-[calc(3px+2vw)] [@media(min-width:550px)]:px-[calc(6px+5vw)] [@media(min-width:640px)]:px-0 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-7 md:gap-5 lg:gap-10"
          >
            {loading
              ? Array.from({ length: Math.min(10, limit) }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl w-full bg-gray-100 animate-pulse h-[280px] sm:h-[360px]"
                  />
                ))
              : items.map((p) => (
                  <SingleProduct
                    key={p._id}
                    image={p.images?.[0] || "/product-2.jpeg"}
                    title={p.title}
                    price={Number(p.price || 0)}
                    slug={p.slug}
                  />
                ))}
          </div>

          {!loading && items.length === 0 && (
            <div className="text-center py-16">
              <p className="font-poppins text-dark/70">No products found.</p>
            </div>
          )}

          <div>
            <div className="flex justify-center items-center gap-5 mt-10 lg:mt-20">
              <button
                disabled={!canPrev}
                onClick={() => canPrev && setPage((p) => p - 1)}
                className="px-4 py-1.5 duration-150 cursor-pointer rounded border-2 text-xl lg:text-2xl font-bebas border-brand text-glow cardButtonHover shadow-sm bg-brand text-text hover:text-dark active:bg-brand active:scale-95 active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="font-poppins">
                Page {meta?.page || page} of {meta?.pages || 1}
              </span>
              <button
                disabled={!canNext}
                onClick={() => canNext && setPage((p) => p + 1)}
                className="px-4 py-1.5 duration-150 cursor-pointer rounded border-2 text-xl lg:text-2xl font-bebas border-brand text-glow cardButtonHover shadow-sm bg-brand text-text hover:text-dark active:bg-brand active:scale-95 active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative h-[50dvh] w-full overflow-hidden mt-15 mb-5 parallax">
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-glow text-text px-4">
          <h1 className="text-5xl sm:text-6xl lg:text-9xl font-bebas drop-shadow-lg">
            <span data-aos="fade-left" data-aos-duration="1200">
              Stay
            </span>{" "}
            <span data-aos="fade-right" data-aos-duration="1200">
              Stylish
            </span>
          </h1>
          <p className="mt-4 text-lg sm:text-2xl text-white/80">
            Elevate Your Wardrobe with Trendy Fashion Picks
          </p>
          <BrandButton href="/" text="home" className="mt-5" />
        </div>
      </section>
    </>
  );
};

export default ShopPage;
