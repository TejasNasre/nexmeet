"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Loading from "@/components/loading";
import Image from "next/image";

interface Community {
  id: string;
  community_name: string;
  logo_url: string;
  tagline: string;
  category: string;
  contact_info: string;
  location: string;
  website: string;
  about: string;
  mission: string;
  benefits: string;
  events: string;
  media_url: string;
  community_size: number;
  created_at: string;
  isApproved: boolean;
}

const CommunityDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCommunity = async () => {
        const { data, error } = await supabase
          .from("communities")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          console.error("Error fetching community:", error);
        } else {
          setCommunity(data);
        }
        setLoading(false);
      };

      fetchCommunity();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!community) {
    return <div>Community not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white py-[8rem] px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <Image
            src={`https://jzhgfowuznosxtwzkbkx.supabase.co/storage/v1/object/public/community-logos/${community.logo_url}`}
            alt={`${community.community_name} logo`}
            className="w-32 h-32 object-contain rounded-full mb-4 border-2 border-white"
            width={128}
            height={128}
          />
          <h1 className="text-4xl font-bold mb-2">
            {community.community_name}
          </h1>
          <p className="text-xl mb-4">{community.tagline}</p>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <span className="bg-white text-black px-4 py-2 rounded-full">
              {community.category}
            </span>
            <span className="bg-white text-black px-4 py-2 rounded-full">
              {community.location}
            </span>
          </div>
          <a
            href={community.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mb-4"
          >
            {community.website}
          </a>
        </div>
        <div className="mt-8 space-y-4">
          <p>
            <strong>About:</strong> {community.about}
          </p>
          <p>
            <strong>Mission:</strong> {community.mission}
          </p>
          <p>
            <strong>Benefits:</strong> {community.benefits}
          </p>
          <p>
            <strong>Events:</strong> {community.events}
          </p>
          <Image
            src={`https://jzhgfowuznosxtwzkbkx.supabase.co/storage/v1/object/public/community-media/${community.media_url}`}
            alt={`${community.community_name} media`}
            className="w-full h-auto object-cover rounded-lg"
            width={800}
            height={400}
          />
          <p>
            <strong>Community Size:</strong> {community.community_size}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(community.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Approved:</strong> {community.isApproved ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetails;
