"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../../../utils/supabase";
import Loading from "../../../../components/loading";
import { useParams } from "next/navigation";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userAuth } from "../../../../action/auth";
import { toast } from "sonner";
import { PhoneIcon, MailIcon } from "lucide-react";

const EventPage = () => {
  const router = useRouter();
  const params = useParams();
  const { spaceId } = params;
  const [spaceData, setSpaceData]: any = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      let { data, error }: any = await supabase
        .from("event_space")
        .select("*,event_space_img_vid(event_space_id,url)")
        .eq("id", spaceId);
      if (error) {
        console.error("Error fetching event details:", error);
        toast.error("Failed to fetch event details.");
      } else {
        setSpaceData(data);
        toast.success("Event details loaded successfully!");
      }
      setIsLoading(false);
    }
    if (spaceId) {
      getData();
    }
  }, [spaceId]);

  async function isUser() {
    userAuth().then((res) => {
      if (!res) {
        router.push("/unauthorized");
        toast.error("Unauthorized access. Please register.");
      } else {
        router.push(`/explore-event-space/request-booking?spaceId=${spaceId}`);
        toast.success("Redirecting to booking...");
      }
    });
  }

  if (isLoading) {
    return <Loading />;
  }

  const img = spaceData[0]?.event_space_img_vid[0]?.url
    ? JSON.parse(spaceData[0].event_space_img_vid[0].url)
    : [];
  
  const amenities = spaceData[0].amenities;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {spaceData.map((space: any) => (
          <div key={space.id} className="space-y-12 mt-10">
            {/* Header Section */}
            <div className="text-center space-y-8">
              <h1 className="text-4xl font-bold tracking-tight">{space.name}</h1>
              
              {/* Image Section */}
              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-xl">
                {img.map((i: any) => (
                  <div key={i} className="w-full">
                    <Image
                      src={i}
                      alt="event image"
                      width={1200}
                      height={675}
                      className="object-cover rounded-xl"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About Space */}
                <div className="bg-black border border-white rounded-xl p-8 space-y-6">
                <div className="relative text-center mb-6">
                  <div className="inline-block px-8 py-2 border-t-4 border-b-4 border-[#FF5733] relative">
                    <h2 className="text-3xl font-semibold text-white tracking-wide">
                      <span className="mr-2 text-[#FFC107]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 inline-block">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2.25l3.3 6.6 7.2.3-5.5 4.8 2 7.05L12 16.5l-6.95 4.5 2-7.05L2.25 9.15l7.2-.3L12 2.25z" />
                        </svg>
                      </span>
                      About Space
                      <span className="ml-2 text-[#FFC107]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 inline-block">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2.25l3.3 6.6 7.2.3-5.5 4.8 2 7.05L12 16.5l-6.95 4.5 2-7.05L2.25 9.15l7.2-.3L12 2.25z" />
                        </svg>
                      </span>
                    </h2>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">{space.description}</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                    <span className="text-[#FF5733]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M12 3l6.5 7H13v5H11V10H5.5L12 3z" />
                        </svg>
                      </span>
                      <span className="text-white text-lg font-semibold">Space Capacity:</span>
                      <span>{space.capacity}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                    <span className="text-[#28A745]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 2a7.5 7.5 0 0 1 7.5 7.5c0 3.75-3.5 7.25-7.5 12.75-4-5.5-7.5-9-7.5-12.75A7.5 7.5 0 0 1 12 2z" />
                      </svg>
                    </span>
                    <span className="text-white text-lg font-semibold">Location:</span>
                      <span>{space.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                      <span className="text-[#FFC107]">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M12 2a10 10 0 0 1 10 10 10 10 0 1 1-20 0 10 10 0 0 1 10-10zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 4v4h4v2h-6V8h2z" />
                          </svg>
                        </span>
                        <span className="text-white text-lg font-semibold">Price Per Hour:</span>
                        <Badge variant="destructive" className="text-lg">
                          <span>₹</span>{space.price_per_hour}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                    <span className="text-[#17A2B8]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 3a9 9 0 0 1 9 9 9 9 0 1 1-18 0 9 9 0 0 1 9-9zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM9 12l3 3 3-6h-6l-1 3z" />
                      </svg>
                    </span>
                    <span className="text-white text-lg font-semibold">Availability:</span>
                    <Badge variant="secondary" className="text-sm">
                      {JSON.stringify(space.availability, null, 2)}
                    </Badge>
                      </div>
                  </div>
                  
                  <Button 
                    variant="outline"
                    className="w-full mt-6 text-white border-white hover:bg-white hover:text-black transition-colors"
                    onClick={() => isUser()}
                  >
                    Request Booking
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Owner Details */}
                <div className="bg-black border border-white rounded-xl p-6 space-y-4">
                  <h2 className="text-xl font-bold">Owner Details</h2>
                  <div className="space-y-2 text-gray-300">
                  <div className="flex flex-col gap-2">
                    <p className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-[#FFC107] dark:text-[#FF5733]" /> {space.owner_contact}
                    </p>
                    <p className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4 text-[#28A745] dark:text-[#17A2B8]" /> {space.owner_email}
                    </p>
                  </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-black border border-white rounded-xl p-6 space-y-4">
                  <h2 className="text-xl font-bold">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                      {amenities.map((tag: any, index: number) => (
                        <Badge 
                          key={tag}
                          className={`${
                            index % 4 === 0 ? "bg-[#FF5733]" : 
                            index % 4 === 1 ? "bg-[#28A745]" : 
                            index % 4 === 2 ? "bg-[#FFC107]" : 
                            "bg-[#17A2B8]"
                          } text-white border-none`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventPage;