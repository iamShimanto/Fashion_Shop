import React from "react";
import BrandButton from "../common-components/BrandButton";

const Parallax = () => {
  return (
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
        <BrandButton href="/shop" text="shop" className="mt-5" />
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
  );
};

export default Parallax;
