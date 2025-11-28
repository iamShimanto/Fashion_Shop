export default function Marquee() {
  return (
    <section className=" pt-20  w-full overflow-hidden">
      <div className="marquee relative w-full overflow-hidden font-bebas uppercase">
        {/* Track wrapper */}
        <div className="flex w-max animate-marquee">
          {[...Array(2)].map((_, trackIndex) => (
            <div key={trackIndex} className="flex flex-nowrap items-center">
              {Array(20)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={`row-${trackIndex}-${index}`}
                    className="flex items-center space-x-12 mr-16"
                  >
                    <span className="text-[50px] md:text-[70px] lg:text-[6rem]  text-brandColor text-dark/90 text-shadow-black3 text-glow text-shadow-extraLight font-bebas whitespace-nowrap">
                      15% off flat sale 15% off
                    </span>
                    <span className="text-[50px] md:text-[70px] lg:text-[5rem] text-border font-bebas text-dark/90 text-glow  text-shadow-light  text-shadow-extraLight whitespace-nowrap">
                      " from our website 15% off "
                    </span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .animate-marquee {
    display: flex;
    width: max-content;
    animation: marquee 120s linear infinite; /* slower */
  }

  /* Slower but still faster on small screens */
  @media (max-width: 768px) {
    .animate-marquee {
      animation-duration: 105s; /* instead of 10s */
    }
  }
`}</style>
    </section>
  );
}
