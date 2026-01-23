import Link from "next/link";
import React from "react";
import { TbArrowNarrowRightDashed } from "react-icons/tb";

const Collections = () => {
  return (
    <section className="h-fit container pt-20 sm:pt-30 lg:pt-40 pb-10 px-3 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between">
        <h2
          data-aos="fade-in"
          data-aos-duration="1200"
          className="text-6xl md:text-7xl text-dark lg:text-8xl font-bebas text-shadow-deep mb-5 underline decoration-brand  decoration-4 lg:decoration-6 w-fit"
        >
          shop now
        </h2>

        <Link
          href={"/shop"}
          className=" h-fit text-4xl text-brand lg:text-dark/80 duration-200 hover:text-brand font-bebas flex gap-2 items-center"
        >
          shop
          <TbArrowNarrowRightDashed />
        </Link>
      </div>

      <div className="container grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-5 lg:gap-6 xl:gap-8 items-center pt-10">
        <Link
          href={{ pathname: "/shop", query: { gender: "men" } }}
          data-aos="fade-up"
          data-aos-duration="600"
          className="group relative h-[50dvh] sm:h-[70dvh] bg-cover rounded-2xl shadow-lg flex justify-center items-center p-5 overflow-hidden"
          style={{ backgroundImage: "url('/men.jpeg')" }}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-none group-hover:backdrop-blur-md transition-all duration-500"></div>

          <h2 className="relative z-10 text-9xl text-shadow-lighter! text-text text-shadow-2xs text-glow font-bebas cursor-pointer">
            men
          </h2>
        </Link>

        <Link
          href={{ pathname: "/shop", query: { gender: "women" } }}
          data-aos="fade-up"
          data-aos-duration="800"
          className="group relative h-[50dvh] sm:h-[70dvh] bg-cover rounded-2xl text-shadow-lighter! shadow-lg flex justify-center items-center p-5 overflow-hidden"
          style={{ backgroundImage: "url('/women.jpeg')" }}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-none group-hover:backdrop-blur-md transition-all duration-500"></div>

          <h2 className="relative z-10 text-9xl text-text text-shadow-2xs text-glow font-bebas cursor-pointer">
            women
          </h2>
        </Link>
      </div>
    </section>
  );
};

export default Collections;
