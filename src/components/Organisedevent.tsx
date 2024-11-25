"use client";
import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function Organisedevent({ user }: any) {
  const [organisedEvent, setOrganisedEvent] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const organizeEvents: any = async () => {
      let { data: organised_events, error } = await supabase
        .from("event_details")
        .select("*")
        .eq("organizer_email", user);

      if (error) {
        console.log(error);
      }
      {
        setLoading(true);
        setOrganisedEvent(organised_events);
        setLoading(false);
        // console.log(organised_events);
      }
    };

    organizeEvents();
  }, [user]);

  return (
    <>
      {organisedEvent && organisedEvent.length > 0 ? (
        loading ? (
          <div className="py-[10rem] flex flex-col justify-center items-center">
            <h1>Loading....</h1>
          </div>
        ) : (
          <>
            {organisedEvent?.map((event) => (
              <div
                key={event.id}
                className="p-4 hover:bg-muted/50 transition-colors flex flex-col gap-2"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {event.event_title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.event_startdate).toLocaleString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin size={16} className="mr-1" />
                      {event.event_location}
                    </div>
                  </div>
                  <Badge variant="outline">Organizer</Badge>
                </div>

                <div className="flex flex-col gap-4 md:flex-row">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-[8rem] text-white"
                  >
                    <Link
                      href={`/explore-events/${event.id}`}
                      className="flex flex-row justify-center items-center"
                    >
                      View Details <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-[15rem] text-white"
                  >
                    <Link
                      href={`/participants-details/${event.id}`}
                      className="flex flex-row justify-center items-center"
                    >
                      View Participant Details{" "}
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </Button>
                  <Link
                    href={`/manage-feedback/${event.id}`}
                    className="flex flex-row"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-[15rem] text-white"
                    >
                      Manage Feedback Form
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </>
        )
      ) : (
        <div className="p-10 text-center text-muted-foreground">
          No events found
        </div>
      )}
    </>
  );
}

export default Organisedevent;
