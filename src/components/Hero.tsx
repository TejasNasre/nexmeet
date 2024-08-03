import React from "react";

function Hero() {
  return (
    <>
      <div className="relative bg-[#060707]">
        <div className=" items-center min-h-screen flex justify-around relative flex-wrap px-5">
          <>
            <div className="bg-[#15d98bfd] h-[362px] w-[362px] absolute rounded-full blur-[120px] filter -top-[100px]  -left-20 opacity-75"></div>
          </>
          <div className="max-w-xl relative">
            <h1 className="font-IBMPlexBold text-6xl max-w-md text-left uppercase">
              NEXMEET <span className="text-[#02C173]">Coming Soon....</span>
            </h1>
            {/* <p className="font-IBMPlexRegular text-left">
              A collection of 10,000 worldly Koalas each with their unique
              skillsets. Their mission is to protect the world from evil.
            </p> */}
            
          </div>
          <div>
            <img
              width="500"
              height="500"
              alt="bg-image"
              src="https://res.cloudinary.com/ddcg0rzlo/image/upload/v1651418249/new-nft_tlfisy.png"
            />
          </div>
        </div>
      </div>
      <div/>
    </>
  );
}

export default Hero;
