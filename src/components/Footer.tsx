import Link from "next/link";
import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white py-10 px-4 md:px-10 z-[999]">
      <div className="container mx-auto flex flex-col gap-8 md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white">Nexmeet</h2>
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
        <p>&copy; {new Date().getFullYear()} Nexmeet. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
