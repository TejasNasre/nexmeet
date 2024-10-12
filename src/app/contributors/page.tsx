"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Github } from "lucide-react";

const ContributorsPage = () => {
  const [contributors, setContributors] = useState<{ id: number; login: string; avatar_url: string; html_url: string; }[]>([]);
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
        setRepoData({ stars: repoData.stargazers_count, forks: repoData.forks_count });
      } catch (error) {
        console.error("Error fetching contributors data:", error);
      }
    };

    fetchContributors();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full bg-black text-white py-[8rem] px-0 flex flex-col justify-start items-center gap-12">
        <h1 className="text-center text-4xl font-bold">Contributors</h1>
        <div className="mb-4 text-center">
          <span className="mr-4">⭐ Stars: {repoData.stars}</span>
          <span>🍴 Forks: {repoData.forks}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {contributors.map((contributor) => (
            <div key={contributor.id} className="p-4 border rounded shadow text-center transition-transform transform hover:scale-105 hover:shadow-lg">
              <img src={contributor.avatar_url} alt={contributor.login} className="w-16 h-16 rounded-full mb-2 mx-auto" />
              <h2 className="text-xl font-semibold">{contributor.login}</h2>
              <a href={contributor.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 flex items-center justify-center gap-2">
                <Github size={16} />
                View Profile
              </a>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContributorsPage;