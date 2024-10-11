"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../utils/supabase";
import Loading from "./loading";
import { Badge } from "./ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userDetails } from "../action/userDetails";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import {
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";

const EventPageClient = ({ eventsId }: { eventsId: string }) => {
  const router = useRouter();
  const { isAuthenticated } = useKindeBrowserClient();

  const [eventData, setEventData]: any = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData]: any = useState([]);
  const [registrationClosed, setRegistrationClosed] = useState(false); // New state

  useEffect(() => {
    async function getData() {
      let { data, error }: any = await supabase
        .from("event_details")
        .select(
          "*,event_images(event_id,url),event_participants(participant_email,is_registered)"
        )
        .eq("id", eventsId);
      if (error) {
        console.error("Error fetching event details:", error);
      } else {
        setEventData(data);
        checkRegistrationStatus(data); // Check registration dates
      }
      setIsLoading(false);
    }
    if (eventsId) {
      getData();
    }
  }, [eventsId]);

  useEffect(() => {
    userDetails().then((res: any) => {
      setUserData(res);
    });
  }, []);

  // Function to check if registration period has ended
  const checkRegistrationStatus = (data: any) => {
    const currentDate = new Date();
    const registrationStartDate = new Date(data[0].event_registration_startdate);
    const registrationEndDate = new Date(data[0].event_registration_enddate);

    if (currentDate < registrationStartDate || currentDate > registrationEndDate) {
      setRegistrationClosed(true); // Set registration closed if outside the valid period
    }
  };

  async function isUser() {
    if (!isAuthenticated) {
      router.push("/unauthorized");
    } else {
      router.push(`/register-event/${eventsId}`);
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  const isRegistered = eventData[0]?.event_participants.some(
    (register: any) => {
      const isMatch =
        register.participant_email === userData?.email &&
        register.is_registered === true;

      return isMatch;
    }
  );

  const img = JSON.parse(eventData[0].event_images[0].url);
  const tags = eventData[0].event_tags;
  const social = eventData[0].event_social_links;

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/explore-events/${eventsId}`;
  const title = "Check out this event on Nexmeet";

  return (
    <>
      <div className="w-full h-auto bg-black text-white py-[5rem] md:py-[8rem] px-[1rem] md:px-[2rem]">
        {eventData.map((event: any) => {
          const isActive = new Date(event.event_startdate) >= new Date();
          return (
          <div
            className="flex flex-wrap justify-center items-center"
            key={event.id}
          >
            <h1 className="text-2xl font-extrabold md:text-4xl text-center">
              {event.event_title}
            </h1>

            <div className="w-full md:w-[80%] py-6 md:p-10">
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
                <p className="text-justify leading-relaxed">
                  {event.event_description}
                </p>
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
                <h1 className="flex flex-row items-center gap-3">
                  <Badge variant="destructive">
                    <span>&#8377;</span>
                    {event.event_price}
                  </Badge>
                  <Badge variant="destructive" className={`${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  { isActive ? "Active" : "Inactive" }
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
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={registrationClosed || isRegistered} // Button disabled if registration is closed
                    onClick={isUser}
                  >
                    {registrationClosed
                      ? "Registration Closed"
                      : isRegistered
                      ? "Registered Waiting For Approval"
                      : "Register Now"}
                  </Button>
                </div>
                <div>
                  {isRegistered ? (
                    <>
                      <Link href={`${event.event_formlink}`}>
                        <Button variant="outline" className="w-full">
                          Actual Form Link
                        </Button>
                      </Link>
                    </>
                  ) : (
                    ""
                  )}
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
                <div className="border border-white rounded-lg p-6 flex flex-col gap-4">
                  <h1 className="text-xl font-bold">
                    Share This Event On Socials
                  </h1>
                  <div className="flex gap-4">
                    {/* Twitter Share Button */}
                    <TwitterShareButton url={shareUrl} title={title}>
                      <TwitterIcon size={30} round />
                    </TwitterShareButton>

                    {/* WhatsApp Share Button */}
                    <WhatsappShareButton url={shareUrl} title={title}>
                      <WhatsappIcon size={30} round />
                    </WhatsappShareButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </>
  );
};

export default EventPageClient;
