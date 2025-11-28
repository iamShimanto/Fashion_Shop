import React from "react";
import Image from "next/image";
import Link from "next/link";
import BrandButton from "../common-components/BrandButton";

const ElivateStyle = () => {
  return (
    <section className="container mx-auto py-15 sm:py-10 lg:py-0 px-3 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div
          data-aos="fade-up"
          data-aos-duration="1200"
          className="relative aspect-[4/5] overflow-hidden rounded-xl"
        >
          <Image
            src="/elivate.jpg"
            alt="Capsule Collection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white text-center p-6">
            <h3 className="text-4xl lg:text-7xl text-glow text-text font-bebas font-semibold">
              Capsule Collection
            </h3>
            <p className="mt-2 text-lg md:text-2xl font-jakarta text-lightBrand">
              Reserved for special occasions
            </p>
            <BrandButton href="/shop" text="Shop Now" className="mt-4" />
          </div>
        </div>

        <div>
          <h2
            data-aos="fade-in"
            data-aos-duration="1000"
            className=" text-[calc(15px+5vw)] sm:text-[calc(10px+5vw)] lg:text-[calc(10px+3vw)] font-bebas text-shadow-lighter text-brand  mb-4"
          >
            Elevate Your Wardrobe
          </h2>
          <p
            data-aos="fade-in"
            data-aos-duration="1200"
            className="text-md sm:text-lg lg:text-xl font-jakarta text-dark/50 mb-8"
          >
            Curated Fashion Just For You. Save Up To 30% Today
          </p>

          <div className="grid grid-cols-2 gap-6">
            <Link
              data-aos="fade-in"
              data-aos-duration="1200"
              href="/"
              className="block text-center overflow-hidden duration-150 transition group"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/elivate2.jpeg"
                  alt="On Sale"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300 rounded-lg">
                  <h3 className="mt-2 text-3xl text-white font-medium font-bebas">
                    On Sale
                  </h3>
                  <p className="text-sm text-gray-200">12 items</p>
                </div>
              </div>
              <h3 className="mt-2 text-3xl text-dark/80 duration-150 group-hover:text-brand font-medium font-bebas">
                On Sale
              </h3>
              <p className="text-sm text-gray-500">12 items</p>
            </Link>

            <Link
              data-aos="fade-in"
              data-aos-duration="1500"
              href="/"
              className="block text-center overflow-hidden duration-150 transition group"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/elivate3.jpeg"
                  alt="Best Seller"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300 rounded-lg">
                  <h3 className="mt-2 text-3xl text-white font-medium font-bebas">
                    Best Seller
                  </h3>
                  <p className="text-sm text-gray-200">12 items</p>
                </div>
              </div>
              <h3 className="mt-2 text-3xl text-dark/80 duration-150 group-hover:text-brand font-medium font-bebas">
                Best Seller
              </h3>
              <p className="text-sm text-gray-500">12 items</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElivateStyle;
