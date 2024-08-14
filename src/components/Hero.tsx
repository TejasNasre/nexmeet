"use client";
import React from "react";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    // <div className="absolute bg-black text-white w-full top-0 h-[100vh] py-10 flex flex-row justify-center items-center">
    //   <div>

    //   </div>
    //   <div></div>
    // </div>

    <div className="absolute top-0 h-screen w-full bg-black text-white flex flex-col-reverse pt-[40rem] md:pt-0 md:justify-center items-center md:flex-row">
        <div className="w-full md:w-[50%] flex flex-col justify-start p-5 md:p-10 gap-4">
          <h1 className="text-4xl font-bold">Empowering Your Green Future</h1>
          <p className="text-2xl">
            {" "}
            Offset your carbon footprint with verified, impactful projects
          </p>
          <button className="md:w-[20rem]  px-6 py-2 bg-transparent border border-black text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
            Explore Projects
          </button>
        </div>
        <div className="w-full md:w-[50%] p-5 md:p-10">
          <img
            src="/abc.png"
            alt="hero-img"
            className="w-full h-full"
          />
        </div>
      </div>
  );
};

export default Hero;