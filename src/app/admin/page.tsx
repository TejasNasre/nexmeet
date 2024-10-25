"use client"; // Add this line at the top

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { userDetails } from "@/action/userDetails";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
}

interface Event {
  id: string;
  event_title: string;
  event_description: string;
  organizer_email: string;
  is_approved: boolean | null; // Include the approval status
}

export default function Admin() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userDetails()
      .then((res: any) => {
        setUser(res);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setUser(null);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const organizeEvents = async () => {
      if (!user) return;

      setLoading(true);
      const { data: organised_events, error } = await supabase
        .from("event_details")
        .select("*")
        .eq("organizer_email", user.email);

      if (error) {
        console.log(error);
      }
      setEvents(organised_events || []);
      setLoading(false);
    };

    organizeEvents();
  }, [user]);

  const handleEventStatusChange = async (eventId: string, isApproved: boolean) => {
    const { error } = await supabase
      .from("event_details")
      .update({ is_approved: isApproved })
      .eq("id", eventId);

    if (error) {
      console.error(`Error changing event approval status:`, error);
    } else {
      // Update local state to reflect the change
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId ? { ...event, is_approved: isApproved } : event
        )
      );
      toast.success(`Event ${isApproved ? "approved" : "rejected"} successfully.`);
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
              Administer Events
            </h1>
            <div className="w-full flex flex-wrap gap-6 justify-center">
              {events.map((event) => (
                <Card key={event.id} className="bg-black w-full flex flex-col h-[auto]">
                  <CardHeader>
                    <CardTitle>{event.event_title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <p className="flex-grow mb-4">{event.event_description}</p>
                    {/* Display the current approval status */}
                    <p className="mb-4">
                        Status: {event.is_approved === null ? "Pending" : event.is_approved ? "Approved" : "Rejected"}
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
          </div>
        </div>
      )}
    </>
  ) : (
    router.push("/unauthorized")
  );
}
