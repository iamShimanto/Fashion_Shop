"use client";

import React from "react";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import SingleProduct from "../common-components/SingleProduct";

const CheckProducts = () => {
  return (
    <section className="px-3 sm:px-6 lg:px-10 py-10">
      <div className="container mx-auto">
        <h2
          data-aos="fade-in"
          data-aos-duration="1200"
          className="text-6xl md:text-7xl text-dark lg:text-8xl font-bebas text-shadow-deep mt-10 mb-15 underline decoration-brand  decoration-4 lg:decoration-6 w-fit"
        >
          check our products
        </h2>

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
          <SplideSlide>
            <SingleProduct
              image="/product-2.jpeg"
              title="Classic Hoodie"
              price={49.99}
            />
          </SplideSlide>

          <SplideSlide>
            <SingleProduct
              image="/product-2.jpeg"
              title="Comfort T-Shirt"
              price={29.99}
            />
          </SplideSlide>

          <SplideSlide>
            <SingleProduct
              image="/product-2.jpeg"
              title="Stylish Jeans"
              price={59.99}
            />
          </SplideSlide>

          <SplideSlide>
            <SingleProduct
              image="/product-2.jpeg"
              title="Casual Jacket"
              price={79.99}
            />
          </SplideSlide>

          <SplideSlide>
            <SingleProduct
              image="/product-2.jpeg"
              title="Urban Sneakers"
              price={89.99}
            />
          </SplideSlide>
        </Splide>
      </div>
    </section>
  );
};

export default CheckProducts;
