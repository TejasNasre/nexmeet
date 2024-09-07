"use client";
import React from "react";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { PanInfo } from "framer-motion";
import { useState, useEffect } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import reviews from "../data/reviews.json";
import data from "../data/community.json";
import { userStore } from "@/store/user";
import { Button } from "./ui/button";

const Hero: React.FC = () => {
  const userAuthStore = userStore((state: any) => state.user);

  const [currentReview, setCurrentReview] = useState(0);
  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (Math.abs(info.offset.x) > 100) {
      removeCard();
    }
  };

  const removeCard = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="absolute top-0 h-[100vh] w-full bg-black text-white">
        <BackgroundBeamsWithCollision>
          <div className="flex flex-col justify-center items-center gap-12">
            <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-white dark:text-white font-sans tracking-tight">
              What&apos;s cooler than Networking?{" "}
              <div className="mono relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div className="mono absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                  <span className="">Nothing dude.</span>
                </div>
                <div className="mono relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                  <span className="">Nothing dude.</span>
                </div>
              </div>
            </h2>

            <div className="flex flex-row justify-center items-center gap-8">
              <Link
                href="/explore-events"
                className="mono transition ease-in-out duration-300 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md p-1 md:p-2"
              >
                Explore Events
              </Link>
              {userAuthStore ? (
                <Link
                  href="/dashboard"
                  className="mono transition ease-in-out duration-300 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md p-1 md:p-2"
                >
                  Dashboard
                </Link>
              ) : (
                <RegisterLink className="mono transition ease-in-out duration-300 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md p-1 md:p-2">
                  Register
                </RegisterLink>
              )}
            </div>
            <h1>project is in development phase</h1>
          </div>
        </BackgroundBeamsWithCollision>

        <div className="py-20 flex flex-col antialiased bg-black items-center gap-10 justify-center relative overflow-hidden">
          <h1 className="mono m-10 text-center text-4xl">
            Nexmeet Community Partner
          </h1>
          <InfiniteMovingCards items={data} direction="right" speed="slow" />
        </div>

        <div className="w-auto bg-black py-20 px-4">
          <h1 className="text-center text-4xl mb-10 text-white">
            Community Reviews
          </h1>
          <div className="relative max-w-3xl mx-auto px-4">
            <div
              className="overflow-hidden"
              style={{
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
              }}
            >
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentReview * 100}%)` }}
              >
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="w-full flex-shrink-0 snap-center px-4 text-center"
                    style={{ scrollSnapAlign: "center" }}
                  >
                    <p className="text-2xl sm:text-3xl md:text-4xl text-white mb-6">
                      &quot;{review.text}&quot;
                    </p>
                    <p className="text-lg sm:text-xl text-gray-400">
                      - {review.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons (hidden on mobile) */}
            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/10 p-2 rounded-full hidden sm:block"
              aria-label="Previous review"
            >
              <IoChevronBackOutline className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/10 p-2 rounded-full hidden sm:block"
              aria-label="Next review"
            >
              <IoChevronForwardOutline className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        <div className="w-full px-4 py-20 bg-black">
          <div className="mx-auto max-w-screen-xl py-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Trusted by eCommerce Businesses
              </h2>

              <p className="mt-4 text-white sm:text-xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
                dolores laborum labore provident impedit esse recusandae facere
                libero harum sequi.
              </p>
            </div>

            <div className="mg-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2  sm:divide-y-0 lg:grid-cols-4">
              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Total Sales
                </dt>

                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  $4.8m
                </dd>
              </div>

              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Official Addons
                </dt>

                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  24
                </dd>
              </div>

              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Total Addons
                </dt>

                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  86
                </dd>
              </div>

              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Downloads
                </dt>

                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  86k
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-black text-white px-4 md:px-10 py-20">
          <h1 className="text-center text-3xl font-bold text-white sm:text-4xl py-10">
            FAQ
          </h1>
          <div className="rounded-xl text-white bg-black">
            <details
              className="group p-6 [&_summary::-webkit-details-marker]:hidden"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white">
                <h2 className="text-lg font-medium">
                  Lorem ipsum dolor sit amet consectetur adipisicing?
                </h2>

                <span className="relative size-5 shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 size-5 opacity-100 group-open:opacity-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 size-5 opacity-0 group-open:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              </summary>

              <p className="mt-4 leading-relaxed text-justify text-white">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic
                veritatis molestias culpa in, recusandae laboriosam neque
                aliquid libero nesciunt voluptate dicta quo officiis explicabo
                consequuntur distinctio corporis earum similique!
              </p>
            </details>

            <details className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white">
                <h2 className="text-lg font-medium">
                  Lorem ipsum dolor sit amet consectetur adipisicing?
                </h2>

                <span className="relative size-5 shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 size-5 opacity-100 group-open:opacity-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 size-5 opacity-0 group-open:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              </summary>

              <p className="mt-4 leading-relaxed text-justify text-white">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab hic
                veritatis molestias culpa in, recusandae laboriosam neque
                aliquid libero nesciunt voluptate dicta quo officiis explicabo
                consequuntur distinctio corporis earum similique!
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
