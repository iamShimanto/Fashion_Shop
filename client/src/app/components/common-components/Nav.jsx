"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CiHeart, CiUser, CiSearch } from "react-icons/ci";
import { PiBagSimpleLight } from "react-icons/pi";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { GrLanguage } from "react-icons/gr";
import CartPopup from "../nav-components/CartPopup";
import { useAuth } from "@/app/providers/AuthProvider";
import toast from "react-hot-toast";

const Nav = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      router.push("/");
    } catch (e) {
      toast.error(e?.message || "Logout failed");
    }
  };

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
        setMobileDropdownOpen(false);
        setMobileUserDropdownOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Search:", inputRef.current.value);
      inputRef.current.blur();
      setSearchOpen(false);
    }
  };

  return (
    <div className="absolute w-full z-50">
      <nav className="mt-3 mx-3 md:mx-5 flex flex-col md:flex-row items-center border-b-2 border-lightBrand rounded-xl nav-custom-shadow bg-white">
        <div className="w-full flex justify-between items-center px-4 lg:px-5 h-15 lg:h-18">
          <Link
            href="https://shimanto.dev"
            target="_blank"
            className="text-[34px] font-bebas text-dark text-shadow-light"
          >
            Shimanto
          </Link>

          <ul className="hidden md:flex items-center gap-5 relative">
            <li>
              <Link
                href="/"
                className="flex gap-1 justify-center items-center text-lg  text-dark font-jakarta duration-150 hover:text-brand"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="flex gap-1 justify-center items-center text-lg  text-dark font-jakarta duration-150 hover:text-brand"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="flex gap-1 justify-center items-center text-lg  text-dark font-jakarta duration-150 hover:text-brand"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="flex gap-1 justify-center items-center text-lg  text-dark font-jakarta duration-150 hover:text-brand"
              >
                My Account
              </Link>
            </li>
          </ul>

          {/* Desktop right icons */}
          <div className="hidden md:flex items-center gap-3 relative">
           

            {/* User dropdown (hover) */}
            <div className="relative group">
              <button className="text-xl lg:text-2xl py-3 text-dark hover:text-brand cursor-pointer">
                <CiUser />
              </button>
              <ul className="absolute -right-22 top-full  py-3 w-48 bg-white nav-custom-shadow shadow-lg rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                {user ? (
                  <>
                    <li className="px-4 pb-2 text-center text-sm text-gray-600">
                      {user.fullName || user.email}
                    </li>
                    <li>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-2xl cardButtonHover text-center font-bebas text-glow bg-brand border-2 border-brand mx-2 text-white hover:text-dark"
                      >
                        Account
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-[calc(100%-16px)] mx-2 px-4 py-2 text-2xl mt-2 cardButtonHover text-center font-bebas text-glow bg-dark border-2 border-dark text-white hover:text-dark"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-2xl cardButtonHover text-center font-bebas text-glow bg-brand border-2 border-brand mx-2 text-white hover:text-dark"
                      >
                        LOGIN
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/registration"
                        className="block px-4 py-2 text-2xl mt-2 cardButtonHover text-center font-bebas text-glow bg-dark border-2 border-dark mx-2 text-white hover:text-dark"
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <Link
              href="/wishlist"
              className="text-xl lg:text-2xl text-dark hover:text-brand"
            >
              <CiHeart />
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="text-xl lg:text-2xl text-dark hover:text-brand"
            >
              <PiBagSimpleLight />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-2xl text-dark ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <HiOutlineX className="text-brand" />
            ) : (
              <HiOutlineMenu className="text-brand" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          ref={menuRef}
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 md:hidden z-50 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4">
            <button
              className="text-2xl text-dark"
              onClick={() => setMenuOpen(false)}
            >
              <HiOutlineX className="text-brand" />
            </button>
          </div>

          <ul className="flex flex-col gap-4 mt-2 px-5">
            <li>
              <Link
                href="/"
                className="text-xl font-bebas hover:text-brand"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="text-xl font-bebas hover:text-brand"
                onClick={() => setMenuOpen(false)}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="text-xl font-bebas hover:text-brand"
                onClick={() => setMenuOpen(false)}
              >
                Account
              </Link>
            </li>

            {/* Mobile demo */}

            <hr className="border-gray-300 my-2" />

            {/* Mobile User Dropdown */}
            <li>
              <button
                className="w-full text-left text-xl font-bebas text-dark hover:text-brand flex gap-1 justify-between items-center"
                onClick={() => setMobileUserDropdownOpen((prev) => !prev)}
              >
                <span className="flex items-center gap-2">
                  <CiUser /> Account
                </span>{" "}
                <span>{mobileUserDropdownOpen ? "▲" : "▼"}</span>
              </button>
              {mobileUserDropdownOpen && (
                <ul className=" flex shadow-lg flex-col gap-2 pt-3 pb-4 px-3 mt-2">
                  {user ? (
                    <>
                      <li className="text-sm text-gray-600 px-1">
                        {user.fullName || user.email}
                      </li>
                      <li>
                        <Link
                          href="/account"
                          className="inline-block text-3xl bg-brand px-2 font-bebas py-2 text-text text-glow border-2 w-full hover:text-brand"
                          onClick={() => setMenuOpen(false)}
                        >
                          Account
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={async () => {
                            await handleLogout();
                            setMenuOpen(false);
                          }}
                          className="inline-block text-3xl bg-dark px-2 font-bebas py-2 text-text text-glow border-2 w-full hover:text-brand"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          href="/login"
                          className="inline-block text-3xl bg-brand px-2 font-bebas py-2 text-text text-glow border-2 w-full hover:text-brand"
                          onClick={() => setMenuOpen(false)}
                        >
                          LOGIN
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/registration"
                          className="inline-block text-3xl bg-dark px-2 font-bebas py-2 text-text text-glow border-2 w-full hover:text-brand"
                          onClick={() => setMenuOpen(false)}
                        >
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </li>

            <hr className="border-gray-300 my-2" />

            {/* Mobile footer icons */}
            <li className="flex items-center gap-4">
              <button
                onClick={() => setCartOpen(true)}
                className="text-2xl text-brand hover:text-brand flex items-center gap-1 font-bold"
              >
                Cart
                <PiBagSimpleLight />
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <CartPopup isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Nav;
