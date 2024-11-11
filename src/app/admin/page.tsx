"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";

interface Event {
  id: string;
  event_title: string;
  event_description: string;
  organizer_email: string;
  is_approved: boolean | null;
}

interface Community {
  id: string;
  community_name: string;
  tagline: string;
  location: string;
  category: string;
  community_size: number;
  isApproved: boolean | null;
}

export default function Admin() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  useEffect(() => {
    const fetchEventsAndCommunities = async () => {
      const { data: events_data, error: eventError } = await supabase
        .from("event_details")
        .select("*");
      if (eventError) {
        console.log(eventError);
      }
      setEvents(events_data || []);

      const { data: communities_data, error: communityError } = await supabase
        .from("communities")
        .select("*");
      if (communityError) {
        console.log(communityError);
      }
      setCommunities(communities_data || []);
      setLoading(false);
    };
    fetchEventsAndCommunities();
  }, []);

  const handleEventStatusChange = async (
    eventId: string,
    isApproved: boolean
  ) => {
    const { error } = await supabase
      .from("event_details")
      .update({ is_approved: isApproved })
      .eq("id", eventId);
    if (error) {
      console.error(`Error changing event approval status:`, error);
    } else {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, is_approved: isApproved } : event
        )
      );
      toast.success(
        `Event ${isApproved ? "approved" : "rejected"} successfully.`
      );
      await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "approval",
          eventDetails: events.find((event) => event.id === eventId),
          isApproved,
        }),
      });
    }
  };

  const handleCommunityStatusChange = async (
    communityId: string,
    isApproved: boolean
  ) => {
    const { error } = await supabase
      .from("communities")
      .update({ isApproved: isApproved })
      .eq("id", communityId);
    if (error) {
      console.error(`Error changing community approval status:`, error);
    } else {
      setCommunities((prevCommunities) =>
        prevCommunities.map((community) =>
          community.id === communityId
            ? { ...community, isApproved: isApproved }
            : community
        )
      );
      toast.success(
        `Community ${isApproved ? "approved" : "rejected"} successfully.`
      );
      await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "community-approval",
          communityDetails: communities.find(
            (community) => community.id === communityId
          ),
          isApproved,
        }),
      });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full h-auto bg-black text-white py-[8rem] px-4 flex flex-col">
          <div className="flex flex-col justify-center items-center gap-4">
            <h1 className="text-3xl font-bold text-center my-10">
              Administer Events & Communities
            </h1>
            {/* Events Section */}
            <div className="w-full flex flex-wrap gap-6 justify-center">
              <h2 className="text-xl font-semibold w-full text-center mb-6">
                Events
              </h2>
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="bg-black w-full flex flex-col h-[auto]"
                >
                  <CardHeader>
                    <CardTitle>{event.event_title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <p className="flex-grow mb-4">{event.event_description}</p>
                    <p className="mb-4">
                      Status:{" "}
                      {event.is_approved === null
                        ? "Pending"
                        : event.is_approved
                          ? "Approved"
                          : "Rejected"}
                    </p>
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        className="w-32 bg-transparent hover:bg-green-500"
                        onClick={() => handleEventStatusChange(event.id, true)} // Approve
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="w-32 bg-transparent hover:bg-red-500"
                        onClick={() => handleEventStatusChange(event.id, false)} // Reject
                      >
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Communities Section */}
            <div className="w-full flex flex-wrap gap-6 justify-center mt-12">
              <h2 className="text-xl font-semibold w-full text-center mb-6">
                Communities
              </h2>
              {communities.map((community) => (
                <Card
                  key={community.id}
                  className="bg-black w-full flex flex-col h-[auto]"
                >
                  <CardHeader>
                    <CardTitle>
                      Community Name: {community.community_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <p className="flex-grow mb-4">
                      Community Tagline: {community.tagline}
                    </p>
                    <p className="flex-grow mb-4">
                      Community Size: {community.community_size} Members
                    </p>
                    <p className="flex-grow mb-4">
                      Location: {community.location}
                    </p>
                    <p className="flex-grow mb-4">
                      Category: {community.category}
                    </p>
                    <p className="mb-4">
                      Status:{" "}
                      {community.isApproved === null
                        ? "Pending"
                        : community.isApproved
                          ? "Approved"
                          : "Rejected"}
                    </p>
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        className="w-32 bg-transparent hover:bg-green-500"
                        onClick={() =>
                          handleCommunityStatusChange(community.id, true)
                        } // Approve
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="w-32 bg-transparent hover:bg-red-500"
                        onClick={() =>
                          handleCommunityStatusChange(community.id, false)
                        } // Reject
                      >
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    router.push("/unauthorized")
  );
}
