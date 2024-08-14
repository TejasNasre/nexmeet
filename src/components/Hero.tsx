"use client";
import React from "react";
import { TextEffect } from '../components/core/text-effect';

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
    <div className="absolute top-0 h-screen w-full bg-black text-white pt-[40rem] md:pt-0 flex flex-col justify-center items-center gap-4">
      <TextEffect per='char' variants={fancyVariants} className="text-center text-4xl font-bold font-dm-mono-light">
        NexMeet
      </TextEffect>
      <TextEffect per='word' variants={fancyVariants} className="text-center text-2xl font-bold">
        The Ultimate Destination for Event Enthusiasts
      </TextEffect>
    </div>
  );
};

export default Hero;