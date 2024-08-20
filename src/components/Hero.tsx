"use client";
import React from "react";
import { TextEffect } from '../components/core/text-effect';
import Link from "next/link";

const Hero: React.FC = () => {
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const fancyVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: () => ({
        opacity: 0,
        y: Math.random() * 100 - 50,
        rotate: Math.random() * 90 - 45,
        scale: 0.3,
        color: getRandomColor(),
      }),
      visible: {
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        color: getRandomColor(),
        transition: {
          type: 'spring',
          damping: 12,
          stiffness: 200,
        },
      },
    },
  };

  return (
    <div className="absolute top-0 min-h-screen w-full bg-black text-white py-20 flex flex-col justify-center items-center gap-4 px-4">
      <TextEffect per='char' variants={fancyVariants} className="text-center text-2xl sm:text-3xl md:text-4xl font-bold font-dm-mono-light">
        NexMeet
      </TextEffect>
      <TextEffect per='word' variants={fancyVariants} className="text-center text-xl sm:text-2xl font-bold">
        The Ultimate Destination for Event Enthusiasts
      </TextEffect>
      <div className="relative mt-10 w-full flex justify-center items-center">
        <div className="bg-new1 text-white w-full sm:w-3/4 flex flex-col sm:flex-row justify-between items-center p-4 rounded-lg shadow-[10px_10px_0px_0px_rgba(0,0,0)]">
          <Link href='/contact' className="hover:animate-pulse bg-new p-4 sm:p-6 md:p-8 text-black font-mono flex mx-auto sm:mx-0 flex-col text-2xl sm:text-3xl md:text-4xl rounded-xl shadow-[10px_10px_0px_0px_rgba(0,0,0)] mb-4 sm:mb-0">
            Join our Community
          </Link>
          <Link href="/about" className="hover:animate-pulse duration-300 bg-new p-4 sm:p-6 md:p-8 text-black font-mono mx-auto sm:mx-0 flex flex-col text-2xl sm:text-3xl md:text-4xl rounded-xl shadow-[10px_10px_0px_0px_rgba(0,0,0)]">
            Get to know about us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;