"use client";

import React, { useEffect, useRef } from "react";

const UserPopup = ({ isOpen, onClose, navigate }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]); // <- stable length dependency

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      ref={popupRef}
      className={`absolute top-14 right-0 z-50 bg-white shadow-lg rounded-lg p-4 w-64 transition-opacity duration-200 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={() => handleNavigate("/login")}
        className="block w-full text-center bg-dark text-white py-2 rounded mb-3 font-semibold hover:bg-brand transition"
      >
        LOGIN
      </button>

      <p className="text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <button
          onClick={() => handleNavigate("/registration")}
          className="text-brand font-medium"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default UserPopup;
