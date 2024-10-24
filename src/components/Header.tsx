"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { userDetails } from "../action/userDetails";
import Image from "next/image";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { BsBrightnessLow } from "react-icons/bs";
import { IoMoon } from "react-icons/io5";

interface User {
  picture: string;
  given_name: string;
  family_name: string;
  email: string;
}

function Header() {
  const { isAuthenticated } = useKindeBrowserClient();
  const pathname = usePathname(); // Use usePathname instead of useRouter

  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    userDetails()
      .then((res: any) => {
        // console.log(res)
        setUser(res);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setUser(null);
      });
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    // Navigation logic if needed
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("white");
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const showDropdown = () => {
    setIsDropdownVisible(true);
  };

  const hideDropdown = () => {
    setIsDropdownVisible(false);
  };

  return (
    <div className="absolute top-0 bg-transparent w-full z-[999] py-6 pr-4 md:px-4 md:py-6">
      <div className="flex justify-between items-center">
        <Link href={"/"} className="mono text-2xl text-white">
          <Image
            src={"/nexmeet.png"}
            width={500}
            height={500}
            alt="NexMeet Logo"
            className="h-8 w-auto"
          />
          {/* NexMeet */}
        </Link>
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
            <div className="flex flex-col gap-8 text-white text-center items-center">
              {renderMenuItems()}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderMenuItems() {
    const navItems = [
      { href: "/", label: "Home" },
      { href: "/explore-events", label: "Explore Events" },
      {
        href: "/explore-event-space",
        label: "Explore Event Spaces",
        requiresAuth: true,
      },
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/contributors", label: "Contributors" },
    ];

    return (
      <>
        <div
          className={`flex justify-center items-center gap-6 ${isMenuOpen ? `flex-col` : `flex-row`}`}
        >
          {navItems.map(({ href, label, requiresAuth }) => {
            if (requiresAuth && !isAuthenticated) return null; // Skip if not authenticated
            const isActive = pathname === href; // Use pathname to determine active link
            return (
              <Link
                key={href}
                href={href}
                onClick={() => handleNavigation(href)}
                className={`pt-3 nav-link flex items-center justify-center h-12 transition-colors box-border ${isActive ? "border-b-2 border-white" : ""}`}
              >
                {label}
              </Link>
            );
          })}
        </div>
        {isAuthenticated ? (
          <>
            <div className="relative" ref={dropdownRef}>
              <div
                onMouseEnter={showDropdown}
                onMouseLeave={hideDropdown}
                className="inline-block cursor-pointer"
              >
                <div
                  onTouchMove={toggleDropdown}
                  className="mono justify-center items-center flex hover:text-gray-300"
                  onMouseEnter={showDropdown}
                  onMouseLeave={hideDropdown}
                >
                  <Image
                    src={user?.picture || "/profile.jpg"}
                    alt="Profile"
                    width={56}
                    height={56}
                    className="rounded-full size-10 border-2 border-white"
                  />
                </div>
                {isDropdownVisible && (
                  <div
                    className="absolute right-0 p-2 mt-0 w-auto bg-black text-white dark:bg-white dark:text-black rounded-md shadow-lg z-20"
                    onMouseEnter={showDropdown}
                    onMouseLeave={hideDropdown}
                  >
                    <div className="py-1 px-2 text-white-700">
                      <p className="font-bold">
                        {user?.given_name} {user?.family_name}
                      </p>
                      <p className="text-sm">{user?.email}</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <Link
                        onClick={() => handleNavigation("/dashboard")}
                        href="/dashboard"
                        className="px-1 py-2 hover:bg-black hover:text-white hover:rounded-xl text-center transition-colors"
                      >
                        Dashboard
                      </Link>
                    </div>
                    <div className="flex flex-col justify-center">
                      <LogoutLink
                        className="mono rounded-md px-2 py-2 hover:bg-black hover:text-white hover:rounded-xl text-center transition-colors"
                        postLogoutRedirectURL="/"
                      >
                        Log out
                      </LogoutLink>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-md">
              {isDarkMode ? (
                <BsBrightnessLow size={24} />
              ) : (
                <IoMoon size={24} />
              )}
            </button>
          </>
        ) : (
          <>
            <LoginLink
              postLoginRedirectURL="/dashboard"
              className="hover:scale-105 px-1 py-1 hover:border-b-2 border-white transition-colors"
            >
              Sign in
            </LoginLink>
            <RegisterLink
              postLoginRedirectURL="/dashboard"
              className="hover:scale-105 px-1 py-1 hover:border-b-2 border-white transition-colors"
            >
              Sign up
            </RegisterLink>

            <button onClick={toggleTheme} className="bg-black p-2 rounded-md">
              {isDarkMode ? (
                <BsBrightnessLow size={24} />
              ) : (
                <IoMoon size={24} />
              )}
            </button>
          </>
        )}
      </>
    );
  }
}

export default Header;
