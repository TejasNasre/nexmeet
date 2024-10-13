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

const Hero: React.FC = () => {
  const { isAuthenticated } = useKindeBrowserClient();

  const [currentReview, setCurrentReview] = useState(0);

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
                className="mono transition ease-in-out duration-300 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md p-1 md:p-2"
              >
                Explore Events
              </Link>
              {isAuthenticated ? (
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
                    end={4800000}
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
                  <CountUp start={0} end={24} duration={10} />
                </dd>
              </div>

              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Total Addons
                </dt>
                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  <CountUp start={0} end={86} duration={10} />
                </dd>
              </div>

              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Downloads
                </dt>
                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  <CountUp start={0} end={86000} duration={10} separator="," />
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
                <h2 className="text-lg font-medium">What is NexMeet?</h2>

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
                NexMeet is your go-to platform for organizing college and social
                events. NexMeet makes it super easy to plan, manage, and enjoy.
                We&apos;re all about bringing people together and making event
                planning fun and hassle-free!
              </p>
            </details>

            <details className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white">
                <h2 className="text-lg font-medium">
                  How do I register for Events?
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
                Browse events on the &quot;Explore Events&quot; tab, click
                &quot;Register,&quot; and fill in the details to sign up. Now,
                all you have to do is show up and have fun!
              </p>
            </details>

            <details className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white">
                <h2 className="text-lg font-medium">
                  Where can I view the events I&apos;ve registered for?
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
                Sign in, go to your profile, and view all your registered events
                under &quot;Your Events.&quot;
              </p>
            </details>

            <details className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white">
                <h2 className="text-lg font-medium">
                  Can I create my own custom events?
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
                Yes, go to your profile, click &quot;Organize Your Own
                Event,&quot; and fill in the details. You are ready to go!
              </p>
            </details>

            <details className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white">
                <h2 className="text-lg font-medium">
                  How do I cancel my event registration?
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
                Go to &quot;Your Events&quot; in Profile, select the event, and
                click &quot;Cancel Registration&quot;
              </p>
            </details>

            <details className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white">
                <h2 className="text-lg font-medium">
                  Can I edit the details of my event after it&apos;s created?
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
                Yes! You can update your event details anytime using
                &quot;Manage your Events&quot; in Profile section.
              </p>
            </details>

            <details className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-white">
                <h2 className="text-lg font-medium">
                  Is there a way to invite my friends to an event?
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
                Yes, click the share button on the event page to invite friends
                via social media or link.
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
