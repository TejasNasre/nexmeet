"use client";

import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function Participatedevent({ user }: any) {
  const [participatEvent, setParticipatEvent] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const participatedEvents: any = async () => {
      let { data: event_participants, error } = await supabase
        .from("event_participants")
        .select("*,event_details(*)")
        .eq("participant_email", "tejasnasre.dev@gmail.com");

      if (error) {
        console.log(error);
      }
      {
        setLoading(true);
        setParticipatEvent(event_participants);
        setLoading(false);
        // console.log(event_participants);
      }
    };
    participatedEvents();
  }, [user]);

  return (
    <>
      {participatEvent && participatEvent.length > 0 ? (
        loading ? (
          <div className="py-[10rem] flex flex-col justify-center items-center">
            <h1>Loading....</h1>
          </div>
        ) : (
          <>
            {participatEvent?.map((event) => (
              <div
                key={event.id}
                className="p-4 hover:bg-muted/50 transition-colors flex flex-col gap-2"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {event.event_details.event_title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        event.event_details.event_startdate
                      ).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin size={16} className="mr-1" />
                      {event.event_details.event_location}
                    </div>
                  </div>
                  <Badge variant="outline">Participant</Badge>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-[8rem] text-white"
                >
                  <Link
                    href={`/explore-events/${event.event_id}`}
                    className="flex flex-row justify-center items-center"
                  >
                    View Details <ChevronRight size={16} className="ml-1" />
                  </Link>
                </Button>
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

export default Participatedevent;
