"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../../../utils/supabase";
import Loading from "../loading";
import { useParams } from "next/navigation";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EventPage = () => {
  const params = useParams();
  const { eventsId } = params;
  const [eventData, setEventData]: any = useState([]);
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

  const img = JSON.parse(eventData[0].event_images[0].url);
  const tags = eventData[0].event_tags;
  const social = eventData[0].event_social_links;

  return (
    <>
      <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem] px-[1rem] md:px-[2rem]">
        {eventData.map((event: any) => (
          <div
            className="flex flex-wrap justify-center items-center"
            key={event.id}
          >
            <h1 className="text-2xl font-extrabold md:text-4xl text-center">
              {event.event_title}
            </h1>

            <div className="w-full md:w-[80%] p-10">
              {img.map((i: any) => {
                return (
                  <div key={i}>
                    <Image
                      src={i}
                      alt="event image"
                      className="w-full"
                      width={500}
                      height={500}
                      loading="lazy"
                    />
                  </div>
                );
              })}
            </div>

            <div className="w-full flex flex-col md:flex-row gap-4">
              <div className="w-full border border-white rounded-lg p-6 flex flex-col gap-2 md:gap-4">
                <h1 className="text-2xl font-extrabold">About The Event</h1>
                <p>{event.event_description}</p>
                <div className="w-full flex flex-col md:flex-row gap-4">
                  <h1 className="flex flex-row items-center gap-2">
                    Event Start&apos;s Form :{" "}
                    {new Date(event.event_startdate).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </h1>
                  <h1 className="flex flex-row items-center gap-2">
                    Event End&apos;s On :{" "}
                    {new Date(event.event_enddate).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </h1>
                </div>
                <h1 className="flex flex-row items-center gap-2">
                  Duration : {event.event_duration} Hours
                </h1>
                <h1>Team Size : {event.team_size}</h1>

                <h1 className="flex flex-row items-center gap-4">
                  Location : {event.event_location}
                </h1>
                <h1 className="flex flex-row items-center">
                  <Badge variant="destructive">
                    <span>&#8377;</span>
                    {event.event_price}
                  </Badge>
                </h1>

                <div className="border border-white"></div>

                <div>
                  <h1 className="text-xl font-bold">Registration Period</h1>
                  <h1>
                    From{" "}
                    {new Date(
                      event.event_registration_startdate
                    ).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    To{" "}
                    {new Date(event.event_registration_enddate).toLocaleString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}{" "}
                  </h1>
                </div>
                <div>
                  <Button variant="outline" className="w-full">
                    <Link href={`/register-event/${eventsId}`}>Register</Link>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="border border-white rounded-lg p-6 flex flex-col gap-2">
                  <h1 className="text-xl font-bold">Organizer</h1>
                  <h1>{event.organizer_name}</h1>
                  <h1>{event.organizer_contact}</h1>
                  <h1>{event.organizer_email}</h1>
                </div>

                <div className="border border-white rounded-lg p-6 flex flex-col gap-2">
                  <h1 className="text-xl font-bold">Category & Tags</h1>
                  <h1>
                    Category :{" "}
                    <Badge variant="secondary">{event.event_category}</Badge>
                  </h1>
                  <h1 className="flex flex-wrap gap-2">
                    Tags :{" "}
                    {tags.map((tag: any) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </h1>
                </div>

                <div className="border border-white rounded-lg p-6">
                  <h1 className="text-xl font-bold">Social Links</h1>
                  <h1 className="w-full flex flex-col text-wrap">
                    {social.map((s: any) => (
                      <Link
                        key={s}
                        href={s}
                        target="_blank"
                        rel="noreferrer"
                        className="text-red-500 break-all"
                      >
                        {s}
                      </Link>
                    ))}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EventPage;
