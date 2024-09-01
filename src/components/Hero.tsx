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

const Hero: React.FC = () => {
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
  }, [reviews.length]);

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
        <div className="h-[40rem] flex flex-col antialiased bg-black items-center gap-10 justify-center relative overflow-hidden">
          <h1 className="mono  text-center text-4xl">
            Nexmeet Community Partner
          </h1>
          <InfiniteMovingCards items={data} direction="right" speed="slow" />
        </div>
        <div className="min-h-screen w-auto bg-black py-20">
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

        <div className="h-screen w-full bg-black flex items-center mt-0 justify-center">
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-white font-serif">
              NexMeet: Where Connections Bloom
            </h2>
            <div className="space-y-4 text-xl text-gray-300 font-light">
              <p>🌸 Join inspiring events</p>
              <p>🍵 Build together at hackathons</p>
              <p>🎋 Grow at dev conferences</p>
              <p>🏮 Illuminate your network</p>
            </div>
            <p className="text-lg text-purple-400 italic">
              &quot;In harmony, we innovate&quot; - NexMeet
            </p>
          </div>
        </div>
        <div className="w-full h-screen bg-black"></div>
      </div>
    </>
  );
};

export default Hero;
