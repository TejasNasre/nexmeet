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
        <h1 className="text-2xl">Logo</h1>
      </div>
      <div className="flex justify-center items-center gap-10">
        {isUser ? (
          <>
            <Link href="/">Home</Link>
            <Link href="/events">Explore Events</Link>
            <Link href="/">About Us</Link>
            <Link href="/">Contact</Link>
            <LogoutLink>Log out</LogoutLink>
          </>
        ) : (
          <>
            <Link href="/">Home</Link>
            <Link href="/events">Explore Events</Link>
            <Link href="/">About Us</Link>
            <Link href="/">Contact</Link>
            <LoginLink postLoginRedirectURL="/events">Sign in</LoginLink>
            <RegisterLink postLoginRedirectURL="/events">Sign up</RegisterLink>
          </>
        )}


      </div>
    </div>
  );
}

export default Header;
