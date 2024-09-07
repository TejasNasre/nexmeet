import Link from "next/link";
import { Ticket, Users, ArrowLeft } from "lucide-react";

export default function Custom404() {
  return (
    <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem] px-[1rem] flex flex-col justify-center items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500 rounded-full blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute left-1/4 top-1/4 w-[400px] h-[400px] bg-pink-500 rounded-full blur-[96px] opacity-20 animate-pulse"></div>
        <div className="absolute right-1/4 bottom-1/4 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[112px] opacity-20 animate-pulse"></div>
      </div>
      <div className="relative z-10 max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-8xl font-bold mb-2 animate-pulse">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              404
            </span>
          </h1>
          <h2 className="text-2xl font-semibold mb-4">Event Not Found!</h2>
        </div>
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white border-opacity-20">
          <div className="flex justify-center space-x-6 mb-6">
            <Ticket className="w-12 h-12 text-purple-400" />
            <Users className="w-12 h-12 text-pink-400" />
          </div>
          <p className="text-lg mb-6 text-center">
            Oops! This event seems to have vanished into thin air!
          </p>
          <p className="text-sm text-gray-400 mb-8 text-center">
            Don&apos;t worry, there are plenty of other exciting events waiting for
            you. Let&apos;s find you a great one!
          </p>
          <Link
            href="/"
            className="block w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-center font-semibold transform hover:scale-105"
          >
            <span className="flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Nex Meet Events
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
