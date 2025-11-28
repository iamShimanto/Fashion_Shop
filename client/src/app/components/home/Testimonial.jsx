import TestimonialSlider from "../sliders/TestimonialSlider";

const Testimonial = () => {
  return (
    <section className="h-full px-3 container pb-20 pt-15 sm:pb-30 lg:pb-40 lg:pt-20 overflow-hidden">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between">
          <h2
            data-aos="fade-in"
            data-aos-duration="1200"
            className="text-6xl md:text-7xl text-dark lg:text-8xl font-bebas text-shadow-deep mb-5 underline decoration-brand decoration-4 lg:decoration-6 w-fit"
          >
            testimonial
          </h2>
        </div>

        <div className="block xl:hidden pt-10 pb-5 lg:pt-15 font-jakarta">
          <TestimonialSlider />
        </div>

        <div className="hidden xl:grid grid-cols-5 gap-5 py-15 lg:py-20 justify-items-center font-jakarta">
          <div className="relative bg-gradient-to-br from-white/80 to-brand/10 border border-lightBrand rounded-xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105 max-w-sm">
            <h4 className="font-semibold text-2xl mb-2 text-dark/80 text-shadow-2xs">
              Sarah Johnson
            </h4>
            <span className="text-lg text-dark/80 text-shadow-2xs">
              Verified Buyer
            </span>
            <p className="text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
              Absolutely love the quality! The delivery was fast, and the
              product exceeded my expectations.
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-white/80 to-brand/10 border border-lightBrand rounded-xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105 max-w-sm">
            <h4 className="font-semibold text-2xl mb-2 text-dark/80 text-shadow-2xs">
              Mark Davis
            </h4>
            <span className="text-lg text-dark/80 text-shadow-2xs">
              Repeat Customer
            </span>
            <p className="text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
              Excellent service and top-notch products. Definitely coming back
              for more.
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-white/80 to-brand/10 border border-lightBrand rounded-xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105 max-w-sm">
            <h4 className="font-semibold text-2xl mb-2 text-dark/80 text-shadow-2xs">
              Emily Carter
            </h4>
            <span className="text-lg text-dark/80 text-shadow-2xs">
              Happy Shopper
            </span>
            <p className="text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
              Smooth shopping experience and great support. Highly recommended!
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-white/80 to-brand/10 border border-lightBrand rounded-xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105 max-w-sm">
            <h4 className="font-semibold text-2xl mb-2 text-dark/80 text-shadow-2xs">
              James Wilson
            </h4>
            <span className="text-lg text-dark/80 text-shadow-2xs">
              Returning Customer
            </span>
            <p className="text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
              I appreciate the quick response from the support team and the
              quality of the items.
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-white/80 to-brand/10 border border-lightBrand rounded-xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105 max-w-sm">
            <h4 className="font-semibold text-2xl mb-2 text-dark/80 text-shadow-2xs">
              Olivia Brown
            </h4>
            <span className="text-lg text-dark/80 text-shadow-2xs">
              Style Enthusiast
            </span>
            <p className="text-sm leading-relaxed mt-2 text-dark/70 text-shadow-2xs">
              Stylish, affordable, and great customer service. Couldn't ask for
              more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
