"use client";
import Link from "next/link";
import { IoLogoTwitter, IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";
import React, { useEffect, useState, useRef } from "react";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";

const Footer: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const isScriptAdded = useRef(false); // Track if script is added

  useEffect(() => {
    if (typeof window !== "undefined" && !isScriptAdded.current) {
      window.gtranslateSettings = {
        default_language: "en",
        detect_browser_language: true,
        wrapper_selector: ".gtranslate_wrapper",
        font_size: 100,
      };

      // Dynamically add the script only once
      const script = document.createElement("script");
      script.src = "https://cdn.gtranslate.net/widgets/latest/popup.js";
      script.defer = true;
      document.body.appendChild(script);

      isScriptAdded.current = true; // Mark script as added
    }
  }, []);

  return (
    <footer className="w-full bg-black text-white py-10 px-4 md:px-10 z-[999]">
      <div className="container mx-auto flex flex-col gap-8 md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <Link
            href={"/"}
            className="transition duration-300 ease-in-out transform hover:scale-105"
          >
            <Image
              src={"/nexmeet.png"}
              width={500}
              height={500}
              alt="NexMeet Logo"
              className="h-8 w-auto transition duration-300 ease-in-out transform hover:scale-105"
            />
          </Link>
          <p className="text-gray-400 mt-2">Your Next Meetup Platform</p>
        </div>

        <div className="flex justify-center md:justify-end gap-6">
          <Link
            href="/"
            target="_blank"
            className="transition hover:scale-110 hover:text-blue-500"
          >
            <FaXTwitter className="h-6 w-6 text-white" />
          </Link>
          <Link
            href="https://github.com/TejasNasre/nexmeet"
            target="_blank"
            className="transition hover:scale-110 hover:text-blue-500"
          >
            <IoLogoGithub className="h-6 w-6 text-white" />
          </Link>
          <Link
            href="/"
            target="_blank"
            className="transition hover:scale-110 hover:text-blue-500"
          >
            <IoLogoLinkedin className="h-6 w-6 text-white" />
          </Link>
          <div
            className="gtranslate_wrapper"
            style={{ position: "absolute", bottom: "30px", left: "30px" }}
          ></div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 text-center">
          <Link href="/about" className="transition hover:text-gray-300">
            About Us
          </Link>
          <Link
            href="/explore-events"
            className="transition hover:text-gray-300"
          >
            Explore Events
          </Link>
          <Link href="/contact" className="transition hover:text-gray-300">
            Contact
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500">
        <p>&copy; {currentYear} Nexmeet. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
