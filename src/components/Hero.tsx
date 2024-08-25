"use client";
import React from "react";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { WobbleCard } from "./ui/wobble-card";
const Hero: React.FC = () => {
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
            <h2 className="mono text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-white dark:text-white font-sans tracking-tight">
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
                className="mono transition ease-in-out delay-100 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md px-4 py-1"
              >
                Explore Events
              </Link>
              <RegisterLink className="mono transition ease-in-out delay-100 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md px-4 py-1">
                Register
              </RegisterLink>
            </div>
          </div>
        </BackgroundBeamsWithCollision>
        <div className="h-[40rem] flex flex-col antialiased bg-black items-center gap-10 justify-center relative overflow-hidden">
          <h1 className="mono text-4xl">Nexmeet Community Partner</h1>
          <InfiniteMovingCards items={data} direction="right" speed="slow" />
        </div>
        <div className="h-screen w-full bg-black">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Create events easily on the go with Nexmeet
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
          With over 100,000 monthly active users, NexMeet is the go-to platform for creating and discovering unforgettable events.
          </p>
        </div>
        
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
        Virtual or In-Person, We've Got You Covered!!
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
        Seamlessly host hybrid events that bring together audiences from around the globe.
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            We have many more things going on for you and in todo-list for the future
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
            Make a bigger community part of your life explore new things and grow yourself in and out.
          </p>
        </div>
      </WobbleCard>
    </div>
        </div>
        <div className="w-full h-screen bg-black"></div>
      </div>
    </>
  );
};

export default Hero;
