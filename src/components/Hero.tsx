import React, { useState } from "react";
import Spline from "@splinetool/react-spline/next";

const Hero: React.FC = () => {
  const [isUpcoming, setIsUpcoming] = useState(true);

  return (
    <div className="flex flex-col items-center">
        <Spline
          scene="https://prod.spline.design/6-yx5IQWbDEb-jBX/scene.splinecode"
        />

      <div className="flex space-x-4 mt-6">
        <button
          className={`px-4 py-2 rounded-l-lg ${
            isUpcoming ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setIsUpcoming(true)}
        >
          Upcoming Events
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg ${
            !isUpcoming ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setIsUpcoming(false)}
        >
          Past Events
        </button>
      </div>

      {/* Placeholder for the card carousel */}
      <div className="mt-8 w-full max-w-4xl">
        {isUpcoming ? (
          <div className="text-center text-lg font-semibold">
            Upcoming Events Carousel Placeholder
          </div>
        ) : (
          <div className="text-center text-lg font-semibold">
            Past Events Carousel Placeholder
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
