"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../../utils/supabase";
import Loading from "../loading";
import { useParams } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";

const EventPage = () => {
  const params = useParams();
  const { eventsId } = params;
  const [eventData, setEventData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      let { data, error }: any = await supabase
        .from("event_details")
        .select("*,event_images(event_id,url)")
        .eq("id", eventsId);
      if (error) {
        console.error("Error fetching event details:", error);
      } else {
        setEventData(data);
      }
      setIsLoading(false);
    }
    if (eventsId) {
      getData();
    }
  }, [eventsId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem] px-[2rem]">
        {eventData.map((event: any) => (
          <div className="flex flex-row p-10" key={event.id}>
            <div className="w-[60%] p-10">
              <Carousel>
                <CarouselContent>
                  {Array.isArray(event.event_images.url) &&
                    event.event_images.url.map(
                      (item: { url: string }, index: number) => (
                        <CarouselItem key={index}>
                          <Image
                            alt={item.url}
                            src={item.url}
                            className="rounded-lg"
                          />
                        </CarouselItem>
                      )
                    )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="p-10 rounded-md flex flex-col gap-4">
              <h1 className="text-3xl font-bold">{event.event_title}</h1>
              <p>Event Description: {event.event_description}</p>
              <p>Event Location: {event.event_location}</p>
              <p>
                Event Registration Date : {event.event_startdate} -{" "}
                {event.event_enddate}
              </p>
              <p>Event Price : {event.event_price}</p>
              <p>Event Location : {event.event_location}</p>
              <p>Event FormLink : {event.event_formlink}</p>
              {/* <p className="flex gap-2">
    Time Left:{" "}
    {event.timer.map((data, index) => (
      <Timer key={index} />
    ))}
  </p> */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EventPage;
