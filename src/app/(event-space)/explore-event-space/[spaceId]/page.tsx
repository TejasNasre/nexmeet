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
                  <h2 className="text-2xl font-bold">About Space</h2>
                  <p className="text-gray-300 leading-relaxed">{space.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                    <span className="text-[#FF5733]">Space Capacity:</span>
                      <span>{space.capacity}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                    <span className="text-[#28A745]">Location:</span>
                      <span>{space.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                      <span className="text-[#FFC107]">Price Per Hour:</span>
                        <Badge variant="destructive" className="text-lg">
                          <span>₹</span>{space.price_per_hour}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                      <span className="text-[#17A2B8]">Availability:</span>
                        <Badge variant="secondary" className="text-sm">
                          {JSON.stringify(space.availability, null, 2)}
                        </Badge>
                      </div>
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
                    <p>{space.owner_contact}</p>
                    <p>{space.owner_email}</p>
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