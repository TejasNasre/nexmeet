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

  useEffect(() => {
    userAuth().then((res) => {
      setIsUser(res);
      // console.log(res);
    });
  }, []);
  return (
    <div className="relative bg-transparent w-100 z-[999] flex justify-between items-center px-8 py-8">
      <div>
        <h1 className="text-2xl"><img src="https://see.fontimg.com/api/renderfont4/aDqK/eyJyIjoiZnMiLCJoIjoyNywidyI6MTAwMCwiZnMiOjI3LCJmZ2MiOiIjRjZGM0YzIiwiYmdjIjoiIzAwMDAwMCIsInQiOjF9/bmV4bWVldA/bronx-bystreets.png" alt="nextmeet_logo" /></h1>
      </div>
      <div className="flex justify-center items-center gap-10 text-white">
        {isUser ? (
          <>
            <Link href="/">Home</Link>
            <Link href="/events" className="transition ease-in-out delay-100 hover: scale-70  hover:translate-y-1 border-double border-2 border-white shadow-[5px_5px_0px_0px_rgba(319,58,227)] rounded-md">Explore Events</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/profile">Profile</Link>
            <LogoutLink>Log out</LogoutLink>
          </>
        ) : (
          <>
            <Link href="/">Home</Link>
            <Link href="/events">Explore Events</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
            <LoginLink postLoginRedirectURL="/events">Sign in</LoginLink>
            <RegisterLink postLoginRedirectURL="/events">Sign up</RegisterLink>
          </>
        )}


      </div>
    </div>
  );
}

export default Header;
