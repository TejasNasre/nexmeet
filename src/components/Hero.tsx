"use client";
import React from "react";
import CountUp from "react-countup";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import reviews from "../data/reviews.json";
import data from "../data/community.json";
import FeatureCards from "./FeatureCards";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import axios from "axios";
import Faq1 from "./faq";

const Hero: React.FC = () => {
  const { isAuthenticated } = useKindeBrowserClient();

  const [currentReview, setCurrentReview] = useState(0);

  const [isStarred, setIsStarred] = useState(false);

  const [repoData, setRepoData] = useState({ stars: 0, forks: 0 });

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const { data: repoData } = await axios.get(
          "https://api.github.com/repos/TejasNasre/nexmeet"
        );
        setRepoData({
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
        });
      } catch (error) {
        console.error("Error fetching contributors data:", error);
      }
    };

    fetchContributors();
  }, []);

  return (
    <>
      <div className="h-full w-full bg-black text-white">
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
                className="mono transition ease-in-out duration-300 hover:scale-105 border-white border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md p-1 md:p-2"
              >
                Explore Events
              </Link>
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="mono transition ease-in-out duration-300 hover:scale-105 border-white border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md p-1 md:p-2"
                >
                  Dashboard
                </Link>
              ) : (
                <RegisterLink className="mono transition ease-in-out duration-300 hover:scale-105 border-white border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md p-1 md:p-2">
                  Register
                </RegisterLink>
              )}
            </div>
            {/* <h1 className="-mb-6">project is in development phase</h1> */}

            <div className="text-center">
              <span className="mr-4">⭐ Stars: {repoData.stars}</span>
            </div>
          </div>
        </BackgroundBeamsWithCollision>

        {/* Feature cards section */}
        <div className="flex flex-col items-center justify-center w-full h-screen bg-black sm:flex sm:flex-row">
          <FeatureCards />
        </div>

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

        <div className="w-full px-4 py-20 bg-black">
          <div className="mx-auto max-w-screen-xl py-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Trusted by Event Organizers and Attendees
              </h2>
              <p className="mt-4 text-white sm:text-xl">
                Discover a world of events with NexMeet! From technical
                workshops to creative meetups, we bring everything to one
                platform. Whether you&apos;re an organizer looking for seamless
                event management or an attendee exploring exciting events near
                you, NexMeet has you covered.
              </p>
            </div>

            <div className="mg-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2  sm:divide-y-0 lg:grid-cols-4">
              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Total Sales
                </dt>
                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  <CountUp
                    start={0}
                    end={1000}
                    duration={10}
                    prefix="$"
                    separator=","
                  />
                </dd>
              </div>

              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Official Addons
                </dt>
                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  <CountUp start={0} end={50} duration={10} />
                </dd>
              </div>

              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Total Addons
                </dt>
                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  <CountUp start={0} end={100} duration={10} />
                </dd>
              </div>

              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Downloads
                </dt>
                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  <CountUp start={0} end={10000} duration={10} separator="," />
                </dd>
              </div>
            </div>
          </div>
        </div>
        <Faq1 />
      </div>
    </>
  );
};

export default Hero;
