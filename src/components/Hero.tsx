"use client";
import React from "react";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState, useEffect } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
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
  }, []);
  const reviews = [
    {
      id: 1,
      text: "NexMeet revolutionized our event planning!",
      author: "Sarah J., Event Organizer",
    },
    {
      id: 2,
      text: "The virtual events feature is a game-changer!",
      author: "Mike R., Tech Enthusiast",
    },
    {
      id: 3,
      text: "Seamless experience for both hosts and attendees.",
      author: "Emily L., Community Manager",
    },
    {
      id: 4,
      text: "NexMeet helped us expand our reach globally.",
      author: "David K., Conference Coordinator",
    },
    {
      id: 5,
      text: "Intuitive interface and powerful features. Love it!",
      author: "Lisa M., Startup Founder",
    },
    {
      id: 6,
      text: "The networking opportunities are unparalleled.",
      author: "Alex T., Business Networker",
    },
    {
      id: 7,
      text: "NexMeet made our hybrid events a breeze to manage.",
      author: "Olivia P., Event Planner",
    },
    {
      id: 8,
      text: "Excellent customer support and constant improvements.",
      author: "Ryan S., Regular User",
    },
  ];
  const data = [
    {
      id: 1,
      name: "Javascript",
      image:
        "https://imgs.search.brave.com/xl1jKnU7is8_lbDdoW--gi84GLzDVtlJWKHraMfD3kk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy82/MTNiNjRmZTMwZTg1/MzAwMDRiYTNhMDMu/cG5n",
    },
    {
      id: 2,
      name: "Python",
      image:
        "https://imgs.search.brave.com/iSGTxs7i-wOFBDsnB01UH9YyCMN2zuCzKFc1AIquTh4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nbWFydC5jb20v/ZmlsZXMvNy9QeXRo/b24tUE5HLUZpbGUu/cG5n",
    },
    {
      id: 3,
      name: "Typescript",
      image:
        "https://imgs.search.brave.com/AabytHoa443MCAt9TuBFZHSOjxLfTuwm76XQg36tZ5A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbi1pY29ucy5j/b20vaWNvbnMyLzIx/MDcvUE5HLzk2L2Zp/bGVfdHlwZV90eXBl/c2NyaXB0X2ljb25f/MTMwMTA4LnBuZw",
    },
    {
      id: 4,
      name: "React Js",
      image:
        "https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png",
    },
    {
      id: 5,
      name: "Node Js",
      image:
        "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/233_Node_Js_logo-512.png",
    },
    {
      id: 6,
      name: "Express Js",
      image:
        "https://imgs.search.brave.com/z57VYeyWddN_q-3x7eZFvi_3EzbVJleUObqTlX-ta1E/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy82/MmE3OGYzNGU0MmQ3/MjlkOTI4YjE3NTQu/cG5n",
    },
    {
      id: 7,
      name: "Mongo DB",
      image:
        "https://imgs.search.brave.com/A5fgk_PDeP_UtAwayg6FF0hKArvi-Lh0iZGHNsT-wlA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9wbHVz/cG5nLmNvbS9pbWct/cG5nL2xvZ28tbW9u/Z29kYi1wbmctZmls/ZS1tb25nb2RiLWxv/Z28tc3ZnLTEwMjQu/cG5n",
    },
    {
      id: 8,
      name: "Next Js",
      image:
        "https://imgs.search.brave.com/LmXdga8vDC4Ol83ajqGDtn9kYjGtidNOfbUOCBegT1c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9icmFu/ZGl0ZWNodHVyZS5h/Z2VuY3kvYnJhbmQt/bG9nb3Mvd3AtY29u/dGVudC91cGxvYWRz/L3dwZG0tY2FjaGUv/TmV4dC5qcy05MDB4/MC5wbmc",
    },
    {
      id: 9,
      name: "React Native",
      image:
        "https://imgs.search.brave.com/byUdanTAsUPZdVQ7DW-pul7im3HiL9A4toKRzk4gSs4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy82/MmE3NGRlODIyMzM0/M2ZiYzIyMDdkMDEu/cG5n",
    },
  ];

  return (
    <>
      <div className="absolute top-0 h-[100vh] w-full bg-black text-white">
        <BackgroundBeamsWithCollision>
          <div className="flex flex-col justify-center items-center gap-12">
            <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-white dark:text-white font-sans tracking-tight">
              What's cooler than Networking?{" "}
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
                className="mono transition ease-in-out duration-300 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md sm:px-4 py-1"
              >
                Explore Events
              </Link>
              <RegisterLink className="mono transition ease-in-out duration-300 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md sm:px-4 py-1">
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
            style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
          >
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review) => (
                <div 
                  key={review.id}
                  className="w-full flex-shrink-0 snap-center px-4 text-center"
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <p className="text-2xl sm:text-3xl md:text-4xl text-white mb-6">"{review.text}"</p>
                  <p className="text-lg sm:text-xl text-gray-400">- {review.author}</p>
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

        <div className="h-screen w-full bg-black flex items-center mt-0 justify-center"><div className="text-center space-y-8">
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
      "In harmony, we innovate" - NexMeet
    </p>
  </div></div>
      </div>
    </>
  );
};

export default Hero;
