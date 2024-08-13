"use client"
import React, { Suspense } from "react";
import Spline from "@splinetool/react-spline/next";

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <Spline scene="https://prod.spline.design/w-PrOzkbP9FvMKE0/scene.splinecode" />
      </Suspense>
    </div>
  );
};

export default Hero;