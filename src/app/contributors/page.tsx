"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";
import Loading from "@/components/loading";
import Image from "next/image";

const ContributorsPage = () => {
  const [contributors, setContributors] = useState<
    { id: number; login: string; avatar_url: string; html_url: string }[]
  >([]);
  const [repoData, setRepoData] = useState({ stars: 0, forks: 0 });

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const { data: contributorsData } = await axios.get(
          "https://api.github.com/repos/TejasNasre/nexmeet/contributors"
        );
        setContributors(contributorsData);

        const { data: repoData } = await axios.get(
          "https://api.github.com/repos/TejasNasre/nexmeet"
        );
        setRepoData({
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
        });
      } catch (error) {
        console.error("Error fetching contributors data:", error);
      }
    };

    fetchContributors();
  }, []);

  if (contributors.length === 0) {
    return <Loading />;
  }

  return (
    <main className="flex-grow w-full bg-black text-white py-[8rem] px-10 flex flex-col justify-start items-center gap-12">
      <h1 className="text-5xl md:text-6xl font-bold mb-12 text-center tracking-tight">
        Contributors
      </h1>
      <div className="mb-4 text-center">
        <span className="mr-4">⭐ Stars: {repoData.stars}</span>
        <span>🍴 Forks: {repoData.forks}</span>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-10">
        {contributors.map((contributor) => (
          <div
            key={contributor.id}
            className="w-72 p-4 border rounded-xl shadow text-center transition-transform transform hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center gap-2 cursor-pointer"
          >
            <Image
              src={contributor.avatar_url}
              alt={contributor.login}
              className="rounded-full mb-2 mx-auto"
              width={64} // Set the width equivalent to w-16 (16 * 4 = 64px)
              height={64} // Set the height equivalent to h-16 (16 * 4 = 64px)
            />
            <h2 className="text-xl font-semibold">{contributor.login}</h2>
            <Link
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white flex items-center justify-center gap-2"
            >
              <FaGithub />
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ContributorsPage;
