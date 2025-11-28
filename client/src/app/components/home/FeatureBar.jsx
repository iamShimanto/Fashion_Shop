"use client";

import { LuUndo2, LuTruck, LuHeadphones, LuBadgeCheck } from "react-icons/lu";

export default function FeatureBar() {
  return (
    <section className="bg-transparent text-dark/80  pb-15 md:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-between place-items-center gap-8 text-center md:text-left">
          <div
            data-aos="fade-up"
            data-aos-duration="800"
            className="flex-1 flex flex-col items-center md:items-start"
          >
            <LuUndo2 className="text-white  w-15 h-15 p-2 mb-4 bg-brand rounded-full mx-auto" />
            <h3 className="text-xl font-bebas pb-2  mx-auto text-brand text-shadow-2xl tracking-wide">
              14-Day Returns
            </h3>
            <p className="text-gray-600 font-jakarta pb-2 text-sm mx-auto text-center">
              Risk-free shopping with easy returns.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="1200"
            className="flex-1 flex flex-col items-center md:items-start"
          >
            <LuTruck className="text-white  w-15 h-15 p-2 mb-4 bg-brand rounded-full mx-auto" />
            <h3 className="text-xl font-bebas pb-2  mx-auto text-brand text-shadow-2xl tracking-wide">
              Free Shipping
            </h3>
            <p className="text-gray-600 font-jakarta pb-2 text-sm mx-auto text-center">
              No extra costs, just the price you see.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="1400"
            className="flex-1 flex flex-col items-center md:items-start"
          >
            <LuHeadphones className="text-white  w-15 h-15 p-2 mb-4 bg-brand rounded-full mx-auto" />
            <h3 className="text-xl font-bebas pb-2  mx-auto text-brand text-shadow-2xl tracking-wide">
              24/7 Support
            </h3>
            <p className="text-gray-600 font-jakarta pb-2 text-sm mx-auto text-center">
              24/7 support, always here just for you.
            </p>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="1800"
            className="flex-1 flex flex-col items-center md:items-start"
          >
            <LuBadgeCheck className="text-white  w-15 h-15 p-2 mb-4 bg-brand rounded-full mx-auto" />
            <h3 className="text-xl font-bebas pb-2  mx-auto text-brand text-shadow-2xl tracking-wide">
              Member Discounts
            </h3>
            <p className="text-gray-600 font-jakarta pb-2 text-sm mx-auto text-center">
              Special prices for our loyal customers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
