"use client";

import React, { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef(null);
  const extraCircleRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const extra = extraCircleRef.current;

    let mouseX = 0,
      mouseY = 0;

    const animate = () => {
      if (dot) dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      if (extra)
        extra.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="hidden lg:flex fixed top-0 left-0 z-50 w-5 h-5 bg-brand border-4 border-white outline-2  outline-lightBrand rounded-full pointer-events-none"
      />
    </>
  );
};

export default CustomCursor;
