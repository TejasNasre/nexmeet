"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "../../../utils/supabase";
import { toast } from "sonner";
import Pagination from "../../../components/Pagination";
import Loading from "../../../components/loading";
import { useUserDetails } from "../../../hooks/useUserDetails";
import Link from "next/link";
import { motion } from "framer-motion";
import { SearchIcon } from '@heroicons/react/solid'; // Import the search icon
import { LocationMarkerIcon } from '@heroicons/react/solid';

const Page: React.FC = () => {
  // Define types
  interface Community {
    id: string;
    community_name: string;
    community_description: string;
    community_location: string;
    community_category: string;
    community_members_count: number;
    community_image: string;
    community_creation_date: string;
  }

  // State hooks
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sortByLikes, setSortByLikes] = useState("");
  const [showAddCommunityForm, setShowAddCommunityForm] = useState(false); // To toggle the form visibility
  const [newCommunity, setNewCommunity] = useState({
    community_name: "",
    community_description: "",
    community_location: "",
    community_category: "",
    community_image: "",
  });
  const [editingCommunityId, setEditingCommunityId] = useState<string | null>(null); // To track the community being edited

  const session = useSession();
  const { user } = useUserDetails();

  useEffect(() => {
    async function fetchCommunities() {
      const { data, error } = await supabase.from("communities").select("*");
      if (error) {
        console.error("Error fetching communities:", error);
        toast.error("Failed to load communities. Please try again later.");
      } else {
        setCommunities(data || []); // Set default to empty array if data is null
      }
      setLoading(false);
    }

    fetchCommunities();
  }, []);

  const handleSearchClick = () => {
    // Perform search action here
    console.log("Search clicked!");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { community_name, community_description, community_location, community_category, community_image } = newCommunity;

    if (editingCommunityId) {
      // Update the community
      const { data, error } = await supabase
        .from("communities")
        .update({
          community_name,
          community_description,
          community_location,
          community_category,
          community_image,
        })
        .eq("id", editingCommunityId);

      if (error) {
        toast.error("Failed to update community.");
        console.error("Error updating community:", error);
      } else {
        toast.success("Community updated successfully!");
        setShowAddCommunityForm(false);
        setEditingCommunityId(null); // Reset editingCommunityId
        // Optionally, update the state locally to reflect the change
        setCommunities((prev) =>
          prev.map((community) =>
            community.id === editingCommunityId
              ? { ...community, ...newCommunity }
              : community
          )
        );
      }
    } else {
      // Insert new community (as before)
      const { data, error } = await supabase
        .from("communities")
        .insert([{
          community_name,
          community_description,
          community_location,
          community_category,
          community_image,
          community_members_count: 0,
          community_creation_date: new Date().toISOString(),
        }]);

      if (error) {
        toast.error("Failed to create community.");
        console.error("Error creating community:", error);
      } else {
        toast.success("Community created successfully!");
        setShowAddCommunityForm(false);
        setNewCommunity({
          community_name: "",
          community_description: "",
          community_location: "",
          community_category: "",
          community_image: "",
        });
        if (Array.isArray(data)) {
          setCommunities((prev) => [...prev, ...data]);
        }
      }
    }
  };

  const handleCancel = () => {
    setNewCommunity({
      community_name: "",
      community_description: "",
      community_location: "",
      community_category: "",
      community_image: "",
    });
    setShowAddCommunityForm(false); // Close the form modal
  };

  const handleJoinCommunity = async (communityId: string) => {
    if (!user || !user.email) {
      toast.error("You need to be logged in to join a community.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("community_members")
        .select("*")
        .eq("email", user.email)
        .eq("community_id", communityId)
        .single();

      if (error && error.code !== 'PGRST116') {
        toast.error("An error occurred while checking membership.");
        console.error("Error checking membership:", error);
        return;
      }

      if (data) {
        toast.error("You are already a member of this community.");
      } else {
        const { error: insertError } = await supabase
          .from("community_members")
          .insert([{ email: user.email, community_id: communityId }]);

        if (insertError) {
          toast.error("Failed to join community. Please try again.");
          console.error("Error joining community:", insertError);
        } else {
          toast.success("You have joined the community!");
          const { error: incrementError } = await supabase
            .rpc('increment_community_members_count', { community_id: communityId });

          if (incrementError) {
            toast.error("Failed to update community member count.");
            console.error("Error incrementing member count:", incrementError);
          } else {
            setCommunities((prev) =>
              prev.map((community) =>
                community.id === communityId
                  ? { ...community, community_members_count: community.community_members_count + 1 }
                  : community
              )
            );
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while joining the community.");
      console.error("Error joining community:", error);
    }
  };

  const handleViewEditCommunity = (community: Community) => {
    setNewCommunity({
      community_name: community.community_name,
      community_description: community.community_description,
      community_location: community.community_location,
      community_category: community.community_category,
      community_image: community.community_image,
    });
    setEditingCommunityId(community.id); // Set the community ID being edited
    setShowAddCommunityForm(true); // Show the form to edit
  };

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
          return b.community_members_count - a.community_members_count;
        } else if (sortByLikes === "low") {
          return a.community_members_count - b.community_members_count;
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
    <div className={`w-full h-auto bg-black text-white py-[8rem] ${loading ? `px-0` : `px-4`}`}>
      <div className="text-5xl md:text-6xl font-bold mb-12 text-center items-center justify-center tracking-tight">
        Explore Communities
      </div>

      <div className="container mx-auto p-6">
        {/* Button to Show Add Community Form */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
            onClick={() => setShowAddCommunityForm(true)}
          >
            Add New Community
          </button>
        </div>

        <div className="w-full my-[3rem] flex flex-col gap-4 justify-end">
          <div className="flex space-x-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search communities..."
                className="bg-black text-white w-full p-2 rounded-md border border-white outline-none pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={handleSearchClick}
              >
                <SearchIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <select
              className="border border-white p-2 rounded-md bg-black text-white"
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
              className="border border-white p-2 rounded-md bg-black text-white"
              value={sortByLikes}
              onChange={(e) => setSortByLikes(e.target.value)}
            >
              <option value="">Sort by Members</option>
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
              <p className="text-gray-500 mt-2 flex items-center">
                <LocationMarkerIcon className="w-5 h-5 text-gray-400 mr-2" />
                {community.community_location}
              </p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleJoinCommunity(community.id)}
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Join
                </button>
                <button
                  onClick={() => handleViewEditCommunity(community)} // View/Edit button
                  className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
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

      {/* Add or Edit Community Form Modal */}
      {showAddCommunityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-black p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">{editingCommunityId ? "Edit Community" : "Add New Community"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="community_name" className="block text-sm font-semibold">Community Name</label>
                <input
                  type="text"
                  id="community_name"
                  className="border border-gray-300 rounded-md w-full p-2 mt-2 bg-black"
                  value={newCommunity.community_name}
                  onChange={(e) => setNewCommunity({ ...newCommunity, community_name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="community_description" className="block text-sm font-semibold">Description</label>
                <textarea
                  id="community_description"
                  className="border border-gray-300 rounded-md w-full p-2 mt-2 bg-black"
                  value={newCommunity.community_description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, community_description: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="community_location" className="block text-sm font-semibold">Location</label>
                <input
                  type="text"
                  id="community_location"
                  className="border border-gray-300 rounded-md w-full p-2 mt-2 bg-black"
                  value={newCommunity.community_location}
                  onChange={(e) => setNewCommunity({ ...newCommunity, community_location: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="community_category" className="block text-sm font-semibold">Category</label>
                <input
                  type="text"
                  id="community_category"
                  className="border border-gray-300 rounded-md w-full p-2 mt-2 bg-black"
                  value={newCommunity.community_category}
                  onChange={(e) => setNewCommunity({ ...newCommunity, community_category: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="community_image" className="block text-sm font-semibold">Community Image URL</label>
                <input
                  type="text"
                  id="community_image"
                  className="border border-gray-300 rounded-md w-full p-2 mt-2 bg-black"
                  value={newCommunity.community_image}
                  onChange={(e) => setNewCommunity({ ...newCommunity, community_image: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  {editingCommunityId ? "Update Community" : "Create Community"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
