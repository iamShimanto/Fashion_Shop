import BrandButton from "@/app/components/common-components/BrandButton";
import Breadcrumb from "@/app/components/common-components/Breadcrumb";
import SingleProduct from "@/app/components/common-components/SingleProduct";

import React from "react";

const ShopPage = () => {
  return (
    <>
      <section className="min-h-screen px-3 pt-28">
        <Breadcrumb />

        <div className="container pt-10  overflow-hidden pb-20">
          <div className="flex justify-between items-center gap-10 mb-10">
            <select className="w-[120px] cursor-pointer p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand font-poppins">
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="35">35</option>
              <option value="40">40</option>
            </select>
            <select className="w-[120px] cursor-pointer p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand font-poppins">
              <option value="sort">Sort by</option>
              <option value="newest">Newest Arrivals</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="bestSellers">Best Sellers</option>
            </select>
          </div>

          <div
            data-aos="fade-in"
            className="[@media(min-width:320px)]:px-0 [@media(min-width:450px)]:px-[calc(3px+2vw)] [@media(min-width:550px)]:px-[calc(6px+5vw)] [@media(min-width:640px)]:px-0 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-7 md:gap-5 lg:gap-10"
          >
            <SingleProduct
              image="/product-13.jpeg"
              title="lorem ipsum torresProduct 1"
              price={49.99}
            />
            <SingleProduct
              image="/product-12.jpeg"
              title="lorem ipsum torresProduct 2"
              price={59.99}
            />
            <SingleProduct
              image="/product-11.jpeg"
              title="lorem ipsum torresProduct 3"
              price={69.99}
            />
            <SingleProduct
              image="/product-3.jpeg"
              title="lorem ipsum torresProduct 4"
              price={79.99}
            />
            <SingleProduct
              image="/product-2.jpeg"
              title="lorem ipsum torresProduct 5"
              price={89.99}
            />
            <SingleProduct
              image="/product-5.jpeg"
              title="lorem ipsum torresProduct 6"
              price={99.99}
            />
            <SingleProduct
              image="/product-6.jpeg"
              title="lorem ipsum torresProduct 7"
              price={109.99}
            />
            <SingleProduct
              image="/product-2.jpeg"
              title="lorem ipsum torresProduct 8"
              price={119.99}
            />
            <SingleProduct
              image="/product-2.jpeg"
              title="lorem ipsum torresProduct 9"
              price={129.99}
            />
            <SingleProduct
              image="/product-2.jpeg"
              title="lorem ipsum torresProduct 10"
              price={139.99}
            />
            <SingleProduct
              image="/product-2.jpeg"
              title="lorem ipsum torresProduct 11"
              price={149.99}
            />
            <SingleProduct
              image="/product-2.jpeg"
              title="lorem ipsum torresProduct 12"
              price={159.99}
            />
            <SingleProduct
              image="/product-2.jpeg"
              title="lorem ipsum torresProduct 7"
              price={109.99}
            />
            <SingleProduct
              image="/product-2.jpeg"
              title="lorem ipsum torresProduct 8"
              price={119.99}
            />
            <SingleProduct
              image="/product-2.jpeg"
              title="lorem ipsum torresProduct 9"
              price={129.99}
            />
            <SingleProduct
              image="/product-2.jpeg"
              title="lorem ipsum torresProduct 10"
              price={139.99}
            />
            <SingleProduct
              image="/product-2.jpeg"
              title="lorem ipsum torresProduct 11"
              price={149.99}
            />
            <SingleProduct
              image="/product-2.jpeg"
              title="lorem ipsum torresProduct 12"
              price={159.99}
            />
          </div>
          <div>
            <div className="flex justify-center items-center gap-5 mt-10 lg:mt-20">
              <button className="px-4 py-1.5 duration-150 cursor-pointer rounded border-2 text-xl lg:text-2xl font-bebas border-brand text-glow  cardButtonHover shadow-sm bg-brand text-text hover:text-dark active:bg-brand active:scale-95 active:shadow-inner">
                Prev
              </button>
              <span className="font-poppins">Page 1 of 3</span>
              <button className="px-4 py-1.5 duration-150 cursor-pointer rounded border-2 text-xl lg:text-2xl font-bebas border-brand  text-glow cardButtonHover shadow-sm bg-brand text-text hover:text-dark active:bg-brand active:scale-95 active:shadow-inner">
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="relative h-[50dvh] w-full overflow-hidden mt-15 mb-5 parallax">
        <div className="absolute inset-0 bg-black/30"></div>

        {/* parallax effect here... */}
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

        <style>{`
        .parallax-bg {
          will-change: transform;
        }
        window.addEventListener('scroll', function() {
          const scrolled = window.scrollY;
          const bg = document.querySelector('.parallax-bg');
          if(bg) bg.style.transform = 'translateY(' + scrolled * 0.3 + 'px) scale(1.1)';
        });
      `}</style>
      </section>
    </>
  );
};

export default ShopPage;
