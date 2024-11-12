"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { supabase } from "@/utils/supabase";
import Image from "next/image";
import Loading from "@/components/loading";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");

  interface Community {
    id: string;
    community_name: string;
    logo_url: string;
    tagline: string;
    category: string;
    community_size: number;
  }

  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommunities() {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("isApproved", true)
        .order("community_name", { ascending: true });

      if (error) {
        console.error("Error fetching communities:", error.message);
      } else {
        setCommunities(data);
        // console.log("Communities:", data);
      }
      setLoading(false);
    }

    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter((community) =>
    community.community_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300 py-[8rem] px-10">
      <div
        className={`${spaceGrotesk.className} flex justify-center items-center`}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-12 text-center tracking-tight font-spaceGrotesk">
          Explore Communities
        </h1>
      </div>

      <div className="max-w-md mx-auto mb-12">
        <input
          type="search"
          placeholder="SEARCH COMMUNITIES..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full dark:bg-black dark:text-white text-black text-xl font-bold px-4 py-2 rounded-full border-4 border-black dark:border-white focus:outline-none focus:border-2 focus:border-black dark:focus:border-white"
        />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          {filteredCommunities.length === 0 ? (
            <div className="text-center text-2xl">No communities found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20">
              {filteredCommunities.map((community) => (
                <div
                  key={community.id}
                  className="dark:bg-black bg-white text-black dark:text-white p-4 rounded-xl border-4 border-black dark:border-white"
                >
                  <div className="w-20 h-20 mx-auto mb-6 overflow-hidden rounded-full bg-black dark:bg-white border-2 border-white">
                    <Image
                      src={`https://jzhgfowuznosxtwzkbkx.supabase.co/storage/v1/object/public/community-logos/${community.logo_url}`}
                      alt={`${community.community_name} logo`}
                      className="w-full h-full object-contain filter invert dark:invert-0 bg-black"
                      width={128}
                      height={128}
                    />
                  </div>
                  <h2 className="text-3xl font-black mb-4 text-center uppercase">
                    {community.community_name}
                  </h2>
                  <p className="text-xl mb-4 text-center">
                    {community.tagline}
                  </p>
                  <div className="flex justify-center mb-4">
                    <span className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-lg font-bold rounded-full">
                      {community.category}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-center mb-6">
                    {community.community_size.toLocaleString()} Members
                  </p>
                  <Link
                    href={`/explore-community/${community.id}`}
                    className="block w-full bg-black dark:bg-white text-white dark:text-black text-center py-2 text-xl font-bold rounded-full"
                  >
                    View Community
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-16 text-center flex justify-center items-center flex-col md:flex-row gap-4">
        <Link
          href="/add-community"
          className="bg-black dark:bg-white text-white dark:text-black text-xl font-bold px-8 py-4 rounded-full transform hover:skew-x-6 transition-transform duration-300"
        >
          Add Your Own Community
        </Link>
        <Link
          href="/community-patnership"
          className="bg-black dark:bg-white text-white dark:text-black text-xl font-bold px-8 py-4 rounded-full transform hover:skew-x-6 transition-transform duration-300"
        >
          Be Community Partner With Nexmeet
        </Link>
      </div>
    </div>
  );
}
