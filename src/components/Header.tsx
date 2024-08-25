"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { userAuth } from "../action/auth";
import { userDetails } from "../action/userDetails";
import Image from "next/image";

interface User {
  picture: string;
}

function Header() {
  const [isUser, setIsUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    userAuth().then((res) => {
      setIsUser(res);
    });

    userDetails()
      .then((res: any) => {
        // console.log(res)
        setUser(res);
      })
      .catch((error) => {
        // console.error('Error fetching user details:', error);
        setUser(null);
      });
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative bg-transparent w-full z-[999] px-4 sm:px-8 py-4 sm:py-8">
      <div className="flex justify-between items-center">
        <h1 className="mono text-2xl text-white">NexMeet</h1>
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
        <div
          className={`flex justify-center items-center gap-6 ${
            isMenuOpen ? `flex-col` : `flex-row`
          }`}
        >
          <Link href="/" className="mono hover:text-gray-300">
            Home
          </Link>
          <Link href="/events" className="mono hover:text-gray-300">
            Explore Events
          </Link>
          <Link href="/about" className="mono hover:text-gray-300">
            About Us
          </Link>
          <Link href="/contact" className="mono hover:text-gray-300">
            Contact
          </Link>
        </div>
        {isUser ? (
          <>
            <Link href="/profile" className="mono justify-center items-center flex hover:text-gray-300">
              <Image
                src={user?.picture || ""}
                alt="Profile"
                width={56}
                height={56}
                className="rounded-full size-10 border-2 border-white"
              />
            </Link>
          </>
        ) : (
          <>
            <LoginLink
              postLoginRedirectURL="/events"
              className="mono transition ease-in-out delay-100 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md px-4 py-1"
            >
              Sign in
            </LoginLink>
            <RegisterLink
              postLoginRedirectURL="/events"
              className="mono transition ease-in-out delay-100 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md px-4 py-1"
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
