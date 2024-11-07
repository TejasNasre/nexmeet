"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "../../../utils/supabase";
import { toast } from "sonner";
import Pagination from "../../../components/Pagination";
import Loading from "../../../components/loading";
import { HeartIcon } from "@heroicons/react/solid";
import { useUserDetails } from "../../../hooks/useUserDetails";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarIcon, MapPinIcon } from "lucide-react";

const Page: React.FC = () => {
  // Define types
  interface Community {
    id: string;
    community_name: string;
    community_description: string;
    community_location: string;
    community_category: string;
    community_members_count: number;
    community_likes: number;
    community_image: string;
    community_creation_date: string;
  }

  // State hooks
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [likedCommunities, setLikedCommunities] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sortByLikes, setSortByLikes] = useState("");
  const session = useSession();
  const { user } = useUserDetails();

  useEffect(() => {
    async function fetchCommunities() {
      const { data, error } = await supabase.from("communities").select("*");
      if (error) {
        console.error("Error fetching communities:", error);
        toast.error("Failed to load communities. Please try again later.");
      } else {
        setCommunities(data);
      }
      setLoading(false);
    }

    fetchCommunities();
  }, []);

  const handleLikeToggle = async (communityId: string) => {
    if (!user) {
      toast.error("You must be logged in to like a community.");
      return;
    }

    const useremail = user.email;
    const { data: likedData, error: checkError } = await supabase
      .from("community_likes")
      .select("community_id")
      .eq("community_id", communityId)
      .eq("useremail", useremail);

    if (checkError) {
      console.error("Error checking likes:", checkError);
      return;
    }

    const isLiked = likedData.length > 0;

    let communityData;
    const { data: fetchedCommunityData, error: fetchError } = await supabase
      .from("communities")
      .select("community_likes")
      .eq("id", communityId)
      .single();

    if (fetchError) {
      console.error("Error fetching community likes:", fetchError);
      return;
    }

    communityData = fetchedCommunityData;

    if (isLiked) {
      const { error: unlikeError } = await supabase
        .from("community_likes")
        .delete()
        .eq("community_id", communityId)
        .eq("useremail", useremail);

      if (unlikeError) {
        console.error("Error unliking community:", unlikeError);
        return;
      }

      const newLikesCount = communityData.community_likes - 1;
      await supabase
        .from("communities")
        .update({ community_likes: newLikesCount })
        .eq("id", communityId);

      setLikedCommunities((prev) => ({
        ...prev,
        [communityId]: false,
      }));
    } else {
      const { error: likeError } = await supabase
        .from("community_likes")
        .insert({ community_id: communityId, useremail });

      if (likeError) {
        console.error("Error liking community:", likeError);
        return;
      }

      const newLikesCount = communityData.community_likes + 1;
      await supabase
        .from("communities")
        .update({ community_likes: newLikesCount })
        .eq("id", communityId);

      setLikedCommunities((prev) => ({
        ...prev,
        [communityId]: true,
      }));
    }
  };

  // Filtering and sorting communities
  const filteredAndSortedCommunities = useMemo(() => {
    return communities
      .filter((community) => {
        const matchesCategory = category ? community.community_category === category : true;
        const matchesSearchTerm =
          community.community_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          community.community_location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearchTerm;
      })
      .sort((a, b) => {
        if (sortByLikes === "high") {
          return b.community_likes - a.community_likes;
        } else if (sortByLikes === "low") {
          return a.community_likes - b.community_likes;
        }
        return 0;
      });
  }, [communities, searchTerm, category, sortByLikes]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCommunities = filteredAndSortedCommunities.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAndSortedCommunities.length / itemsPerPage);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
    <div
        className={`w-full h-auto bg-black text-white py-[8rem] ${
          loading ? `px-0` : `px-4`
        }`}
    >
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search communities..."
            className="bg-black text-white w-full p-2 rounded-md border-0 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className=" border border-white p-2 rounded-md bg-black text-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Sports">Sports</option>
            <option value="Music">Music</option>
            <option value="Art">Art</option>
          </select>
          <select
            className=" border border-white p-2 rounded-md bg-black text-white"
            value={sortByLikes}
            onChange={(e) => setSortByLikes(e.target.value)}
          >
            <option value="">Sort by Likes</option>
            <option value="high">High to Low</option>
            <option value="low">Low to High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentCommunities.map((community) => (
          <motion.div
            key={community.id}
            className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={community.community_image}
              alt={community.community_name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-xl font-semibold mt-3">{community.community_name}</h3>
            <p className="text-gray-500 mt-2">{community.community_description}</p>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <HeartIcon
                  className={`h-6 w-6 ${likedCommunities[community.id] ? "text-red-500" : "text-gray-400"}`}
                  onClick={() => handleLikeToggle(community.id)}
                />
                <span>{community.community_likes} Likes</span>
              </div>
              <Link href={`/community/${community.id}`} className="text-blue-500 hover:text-blue-700">
                View Community
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-[3rem]">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      </div>
    </div>
    </div>
    </>
  );
};

export default Page;
