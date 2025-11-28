"use client";

import React, { useRef } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { TbArrowNarrowRightDashed } from "react-icons/tb";

const truncateText = (text, wordLimit) => {
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
};

const TestimonialSlider = () => {
  const splideRef = useRef(null);

  return (
    <div className="relative h-full ">
      <Splide
        ref={splideRef}
        options={{
          type: "loop",
          perPage: 1,
          gap: "1rem",
          arrows: false,
          pagination: true,
          drag: "free",
          autoplay: true,
          interval: 4000,
          speed: 1200,
          keyboard: "global",
          pauseOnHover: false,
        }}
        className="h-full"
      >
        <SplideSlide>
          <div className="flex justify-center">
            <div className="relative bg-gradient-to-br from-white/80 to-brand/10 border border-lightBrand rounded-xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105 max-w-sm mt-10 mb-15 font-jakarta">
              <h4 className="font-semibold text-2xl mb-2 text-dark/80 text-shadow-2xs">
                Sarah Johnson
              </h4>
              <span className="text-lg text-dark/80 text-shadow-2xs">
                Verified Buyer
              </span>

              {/* Full text on desktop, truncated on mobile */}
              <p className="hidden sm:block text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
                Absolutely love the quality! The delivery was fast, and the
                product exceeded my expectations.
              </p>
              <p className="block sm:hidden text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
                {truncateText(
                  "Absolutely love the quality! The delivery was fast, and the product exceeded my expectations.",
                  10
                )}
              </p>
            </div>
          </div>
        </SplideSlide>

        <SplideSlide>
          <div className="flex justify-center">
            <div className="relative bg-gradient-to-br from-white/80 to-brand/10 border border-lightBrand rounded-xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105 max-w-sm mt-10 mb-15 font-jakarta">
              <h4 className="font-semibold text-2xl mb-2 text-dark/80 text-shadow-2xs">
                Mark Davis
              </h4>
              <span className="text-lg text-dark/80 text-shadow-2xs">
                Repeat Customer
              </span>

              <p className="hidden sm:block text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
                Excellent service and top-notch products. Definitely coming back
                for more.
              </p>
              <p className="block sm:hidden text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
                {truncateText(
                  "Excellent service and top-notch products. Definitely coming back for more.",
                  10
                )}
              </p>
            </div>
          </div>
        </SplideSlide>

        <SplideSlide>
          <div className="flex justify-center">
            <div className="relative bg-gradient-to-br from-white/80 to-brand/10 border border-lightBrand rounded-xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105 max-w-sm mt-10 mb-15 font-jakarta">
              <h4 className="font-semibold text-2xl mb-2 text-dark/80 text-shadow-2xs">
                Emily Carter
              </h4>
              <span className="text-lg text-dark/80 text-shadow-2xs">
                Happy Shopper
              </span>

              <p className="hidden sm:block text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
                Smooth shopping experience and great support. Highly
                recommended!
              </p>
              <p className="block sm:hidden text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
                {truncateText(
                  "Smooth shopping experience and great support. Highly recommended!",
                  10
                )}
              </p>
            </div>
          </div>
        </SplideSlide>

        <SplideSlide>
          <div className="flex justify-center">
            <div className="relative bg-gradient-to-br from-white/80 to-brand/10 border border-lightBrand rounded-xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105 max-w-sm mt-10 mb-15 font-jakarta">
              <h4 className="font-semibold text-2xl mb-2 text-dark/80 text-shadow-2xs">
                James Wilson
              </h4>
              <span className="text-lg text-dark/80 text-shadow-2xs">
                Returning Customer
              </span>

              <p className="hidden sm:block text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
                I appreciate the quick response from the support team and the
                quality of the items.
              </p>
              <p className="block sm:hidden text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
                {truncateText(
                  "I appreciate the quick response from the support team and the quality of the items.",
                  10
                )}
              </p>
            </div>
          </div>
        </SplideSlide>

        <SplideSlide>
          <div className="flex justify-center">
            <div className="relative bg-gradient-to-br from-white/80 to-brand/10 border border-lightBrand rounded-xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105 max-w-sm mt-10 mb-15 font-jakarta">
              <h4 className="font-semibold text-2xl mb-2 text-dark/80 text-shadow-2xs">
                Olivia Brown
              </h4>
              <span className="text-lg text-dark/80 text-shadow-2xs">
                Style Enthusiast
              </span>

              <p className="hidden sm:block text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
                Stylish, affordable, and great customer service. Couldn't ask
                for more.
              </p>
              <p className="block sm:hidden text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
                {truncateText(
                  "Stylish, affordable, and great customer service. Couldn't ask for more.",
                  10
                )}
              </p>
            </div>
          </div>
        </SplideSlide>
      </Splide>

      <button
        onClick={() => splideRef.current.splide.go("<")}
        className="flex absolute top-5/6 sm:top-1/2 left-2 -translate-y-1/2 z-20 bg-transparent border-2 border-brand text-dark sm:bg-white/70 hover:bg-brand hover:text-white p-3 rounded-full shadow-2xl transition"
      >
        <TbArrowNarrowRightDashed className="rotate-180" size={20} />
      </button>
      <button
        onClick={() => splideRef.current.splide.go(">")}
        className="flex absolute top-5/6 sm:top-1/2 right-2 -translate-y-1/2 z-20 bg-transparent border-2 border-brand text-dark sm:bg-white/70 hover:bg-brand hover:text-white p-3 rounded-full shadow-2xl transition"
      >
        <TbArrowNarrowRightDashed size={20} />
      </button>
    </div>
  );
};

export default TestimonialSlider;
