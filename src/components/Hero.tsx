"use client";
import React, { useState, useEffect } from "react";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { PanInfo } from "framer-motion";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import reviews from "../data/reviews.json";
import data from "../data/community.json";
import FeatureCards from "./FeatureCards";

const Hero: React.FC = () => {
  // State for managing the current review index
  const [currentReview, setCurrentReview] = useState(0);
  
  // Functions to navigate through reviews
  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Function to handle drag end for mobile swipe
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (Math.abs(info.offset.x) > 100) {
      removeCard();
    }
  };

  // Function to remove current card (used in drag end)
  const removeCard = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  // Effect for auto-rotating reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);
  
  return (
    <>
      <div className="absolute top-0 h-[100vh] w-full bg-black text-white">
        {/* Main hero section with background effect */}
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

            {/* Call-to-action buttons */}
            <div className="flex flex-row justify-center items-center gap-8">
              <Link
                href="/events"
                className="mono transition ease-in-out duration-300 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md p-1 md:p-2"
              >
                Explore Events
              </Link>
              <RegisterLink className="mono transition ease-in-out duration-300 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md p-1 md:p-2">
                Register
              </RegisterLink>
            </div>
            <h1>project is in development phase</h1>
          </div>
        </BackgroundBeamsWithCollision>
        
        {/* Feature cards section */}
        <div className="flex flex-col items-center justify-center w-full h-screen bg-black sm:flex sm:flex-row">
          <FeatureCards />
        </div>

        {/* Community partner section */}
        <div className="h-screen flex flex-col antialiased bg-black items-center gap-10 justify-center relative overflow-hidden">
          <h1 className="mono text-center text-4xl">
            Nexmeet Community Partner
          </h1>
          <InfiniteMovingCards items={data} direction="right" speed="slow" />
        </div>

        {/* Community reviews section */}
        <div className="h-screen w-full bg-black flex flex-col justify-center items-center">
  <h1 className="text-center text-2xl sm:text-3xl md:text-4xl text-white font-bold">
    Community Reviews
  </h1>
  <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
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
            className="w-full flex-shrink-0 snap-center px-4 flex flex-col justify-center items-center h-[300px] sm:h-[400px]"
          >
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-4 text-center">
              &quot;{review.text}&quot;
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 text-center">
              - {review.author}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Navigation buttons */}
    <button
      onClick={prevReview}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/10 p-2 rounded-full"
      aria-label="Previous review"
    >
      <IoChevronBackOutline className="h-6 w-6 text-white" />
    </button>
    <button
      onClick={nextReview}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/10 p-2 rounded-full"
      aria-label="Next review"
    > 
      <IoChevronForwardOutline className="h-6 w-6 text-white" />
    </button>
  </div>
</div>

        {/* Empty section (placeholder or for future content) */}
        <div className="w-full h-screen bg-black"></div>
      </div>
    </>
  );
}

export default Hero;