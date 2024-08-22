"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { userAuth } from "../action/auth";

function Header() {
  const [isUser, setIsUser] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    userAuth().then((res) => {
      setIsUser(res);
    });
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative bg-transparent w-full z-[999] px-4 sm:px-8 py-4 sm:py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl">
            <img
              src="https://see.fontimg.com/api/renderfont4/aDqK/eyJyIjoiZnMiLCJoIjoyNywidyI6MTAwMCwiZnMiOjI3LCJmZ2MiOiIjRjZGM0YzIiwiYmdjIjoiIzAwMDAwMCIsInQiOjF9/bmV4bWVldA/bronx-bystreets.png"
              alt="nextmeet_logo"
              className="h-6 sm:h-8"
            />
          </h1>
        </div>

        {/* Hamburger Menu Button */}
        <button
          className="lg:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex justify-center items-center gap-6 text-white">
          {renderMenuItems()}
        </div>
      </div>

      {/* Full Viewport Height Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[1000] lg:hidden flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={toggleMenu}
          ></div>
          <div className="relative bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg w-full h-full flex flex-col justify-center items-center transform transition-all duration-300 ease-in-out">
            <button
              className="absolute top-4 right-4 text-white"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex flex-col gap-8 text-white text-center">
              {renderMenuItems()}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderMenuItems() {
    return (
      <>
        <Link href="/" className="text-xl hover:text-gray-300">
          Home
        </Link>
        <Link href="/events" className="text-xl hover:text-gray-300">
          Explore Events
        </Link>
        <Link href="/about" className="text-xl hover:text-gray-300">
          About Us
        </Link>
        <Link href="/contact" className="text-xl hover:text-gray-300">
          Contact
        </Link>
        {isUser ? (
          <>
            <Link href="/profile" className="text-xl hover:text-gray-300">
              Profile
            </Link>
            <LogoutLink className="text-xl hover:text-gray-300">
              Log out
            </LogoutLink>
          </>
        ) : (
          <>
            <LoginLink
              postLoginRedirectURL="/events"
              className="text-xl transition ease-in-out delay-100 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md px-4 py-1"
            >
              Sign in
            </LoginLink>
            <RegisterLink
              postLoginRedirectURL="/events"
              className="text-xl transition ease-in-out delay-100 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md px-4 py-1"
            >
              Sign up
            </RegisterLink>
          </>
        )}
      </>
    );
  }
}

export default Header;
