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
import { Comment } from "@/components/ui/comment";
import { FaXTwitter } from "react-icons/fa6";

import { PhoneIcon, MailIcon, User, ArrowRight, Tags } from "lucide-react";
import { toast } from "sonner";


import {
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import { CalendarDays, MapPin, Users, Clock } from "lucide-react"; // Added icons from Lucide

const EventPageClient = ({ eventsId }: { eventsId: string }) => {
  const router = useRouter();
  const { isAuthenticated } = useKindeBrowserClient();

  const [eventData, setEventData]: any = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData]: any = useState([]);
  const [registrationClosed, setRegistrationClosed] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<
    { id: string; text: string; author: string; timestamp: string }[]
  >([]);
  const [eventEnded, seteventEnded] = useState(false);
  const [eventFeedbackLink, seteventFeedbackLink] = useState("");

  useEffect(() => {
    if (eventData.length > 0) {
      const currentDate = new Date();
      const registrationStartDate = new Date(
        eventData[0].event_registration_startdate
      );
      const registrationEndDate = new Date(
        eventData[0].event_registration_enddate
      );

      setIsRegistrationOpen(
        currentDate >= registrationStartDate &&
          currentDate <= registrationEndDate
      );
    }
  }, [eventData]);

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
    async function fetchAndSetEventStatus() {
      const { data, error } = await supabase
        .from("event_details")
        .select("event_enddate,event_formlink")
        .eq("id", eventsId)
        .single();

      if (error) {
        console.error("Error fetching event data:", error);
        return;
      }

      const currentDate = new Date();
      const endDate = new Date(data.event_enddate);

      // Calculate the event status based on the current date
      if (currentDate > endDate) {
        seteventEnded(true); // Event has ended
      }

      seteventFeedbackLink(
        data.event_formlink || `/event-feedback/${eventsId}`
      );
    }

    fetchAndSetEventStatus();
  }, [eventsId]);

  useEffect(() => {
    userDetails().then((res: any) => {
      setUserData(res);
    });
  }, []);

  useEffect(() => {
    fetchComments();
  }, [eventsId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("event_id", eventsId);

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data);
    }
  };

  const checkRegistrationStatus = (data: any) => {
    const currentDate = new Date();
    const registrationStartDate = new Date(
      data[0].event_registration_startdate
    );
    const registrationEndDate = new Date(data[0].event_registration_enddate);

    if (
      currentDate < registrationStartDate &&
      currentDate > registrationEndDate
    ) {
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
    (register: any) =>
      register.participant_email === userData?.email && register.is_registered
  );

  const img =
    eventData[0]?.event_images?.[0]?.url &&
    typeof eventData[0].event_images[0].url === "string"
      ? JSON.parse(eventData[0].event_images[0].url)
      : []; // Default to an empty array if no valid URL

  const tags = eventData[0].event_tags;
  const social = eventData[0].event_social_links;

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/explore-events/${eventsId}`;
  const title = "Check out this event on Nexmeet";

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
        toast.error("You are not logged in! Please log in to comment.");
        return;
    }

    if (comment.trim().length > 50) {
        toast.error("Comment must not exceed 50 characters.");
        return;
    }

    if (comment.trim()) {
      const { error } = await supabase.from("comments").insert([
        {
          event_id: eventsId,
          author:
            `${userData?.given_name} ${userData?.family_name}` || "Anonymous",
          text: comment,
        },
      ]);

      if (error) {
        console.error("Error adding comment:", error);
      } else {
        setComments([
          ...comments,
          {
            author:
              `${userData?.given_name} ${userData?.family_name}` || "Anonymous",
            text: comment,
            timestamp: new Date().toISOString(),
            id: "",
          },
        ]);
        setComment(""); // Clear the comment input
      }
    }
  };

  const createGoogleCalendarLink = (event: any) => {
    const eventTitle = encodeURIComponent(event.event_title);
    const eventDescription = encodeURIComponent(event.event_description);
    const eventLocation = encodeURIComponent(event.event_location);
    const eventStart = new Date(event.event_startdate)
      .toISOString()
      .replace(/-|:|\.\d{3}/g, "");
    const eventEnd = new Date(event.event_enddate)
      .toISOString()
      .replace(/-|:|\.\d{3}/g, "");

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDescription}&location=${eventLocation}&dates=${eventStart}/${eventEnd}`;
  };

  return (
    <>
      <div className="w-full h-auto bg-black text-white py-[5rem] md:py-[8rem] px-[1rem] md:px-[2rem] flex justify-center">
        {eventData.map((event: any) => {
          const isActive = new Date(event.event_startdate) >= new Date();
          return (
            <div
              className="flex flex-wrap justify-center items-center max-w-6xl"
              key={event.id}
            >
              <div className="w-full flex flex-col justify-center items-center">
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
              </div>

              <div className="w-full flex flex-col md:flex-row gap-4">
                <div className="">
                  <div className="w-full border border-white rounded-lg p-6 flex flex-col gap-2 md:gap-4">
                    <h1 className="text-2xl font-extrabold">About The Event</h1>
                    <p className="text-justify leading-relaxed">
                      {event.event_description}
                    </p>
                    <div className="w-full flex flex-col md:flex-row gap-4">
                      <h1 className="flex flex-row items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-[#FFC107]" />
                        Event Start&apos;s From :{" "}
                        {new Date(event.event_startdate).toLocaleString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </h1>
                      <h1 className="flex flex-row items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-[#FFC107]" />
                        Event End&apos;s On :{" "}
                        {new Date(event.event_enddate).toLocaleString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </h1>
                    </div>
                    <h1 className="flex flex-row items-center gap-2">
                      <Clock className="w-5 h-5 text-[#28A745]" />
                      Duration : {event.event_duration} Hours
                    </h1>
                    <h1 className="flex flex-row items-center gap-2">
                      <Users className="w-5 h-5 text-[#17A2B8]" />
                      Team Size : {event.team_size}
                    </h1>

                    <h1 className="flex flex-row items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#FFC107]" />
                      Location : {event.event_location}
                    </h1>
                    <h1 className="flex flex-row items-center gap-3">
                      <Badge variant="destructive">
                        <span>&#8377;</span>
                        {event.event_price}
                      </Badge>
                      <Badge
                        variant="destructive"
                        className={`${
                          isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
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
                        {new Date(
                          event.event_registration_enddate
                        ).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                      </h1>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        className={`w-full transition-transform duration-300 ease-in-out transform ${
                          registrationClosed ||
                          isRegistered ||
                          !isRegistrationOpen
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-105"
                        }`}
                        disabled={
                          registrationClosed ||
                          isRegistered ||
                          !isRegistrationOpen
                        }
                        onClick={isUser}
                      >
                        {registrationClosed
                          ? "Registration Closed"
                          : isRegistered
                          ? "Registered ✔️"
                          : !isRegistrationOpen
                          ? "Registration Closed"
                          : "Register Now"}
                      </Button>
                    </div>
                    <div>
                      {isRegistered && eventEnded ? (
                        <Link href={eventFeedbackLink}>
                          <Button variant="outline" className="w-full">
                            Submit Feedback
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                    <Button
                      variant="outline"
                      className={`w-full ${
                        isRegistered ? "" : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={
                        isRegistered
                          ? () =>
                              window.open(
                                createGoogleCalendarLink(event),
                                "_blank"
                              )
                          : undefined
                      }
                      disabled={!isRegistered}
                    >
                      Save to Google Calendar
                    </Button>
                  </div>
                </div>

                <div className="w-full md:w-[30%]">
                <div className="border border-white rounded-lg p-6 flex flex-col gap-2 mb-2.5">
                    <h1 className="text-xl font-bold">Organizer</h1>
                    <h1 className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#FFC107]" />
                      {event.organizer_name}
                    </h1>
                    <h1 className="flex items-center gap-2">
                      <PhoneIcon className="w-5 h-5 text-[#28A745]" />
                      {event.organizer_contact}
                    </h1>
                    <h1 className="flex items-center gap-2">
                      <MailIcon className="w-5 h-5 text-[#17A2B8]" />
                      {event.organizer_email}
                    </h1>
                  </div>

                  <div className="border border-white rounded-lg p-6 flex flex-col gap-2 mb-2.5">
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

                  <div className="border border-white rounded-lg p-6 flex flex-col gap-2 mb-2.5">
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

                  <div className="border border-white rounded-lg p-6 flex flex-col gap-2 mb-2.5">
                    <h1 className="text-xl font-bold">
                      Share This Event On Socials
                    </h1>
                    <div className="flex gap-4">
                      {/* Twitter Share Button */}
                      <TwitterShareButton
                        url={shareUrl}
                        title={title}
                        className="hover:scale-110 transition-transform transform duration-300 ease-in-out"
                      >
                        <FaXTwitter size={30} />
                      </TwitterShareButton>

                      {/* WhatsApp Share Button */}
                      <WhatsappShareButton
                        url={shareUrl}
                        title={title}
                        className="hover:scale-110 transition-transform transform duration-300 ease-in-out"
                      >
                        <WhatsappIcon size={30} round />
                      </WhatsappShareButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment Section moved to the end on mobile */}
              <div className="w-full md:w-[90%] order-2 md:order-none">
                <form
                  onSubmit={handleCommentSubmit}
                  className="mt-4 border border-white p-4 flex flex-col gap-4 rounded-xl"
                >
                  <h1 className="text-xl">Leave Comments</h1>
                  <textarea
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Leave a comment..."
                    className="w-full bg-black p-2 border border-gray-300 rounded"
                    rows={4}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="mt-2 w-full"
                    disabled={!isAuthenticated} // Disable if not authenticated
                  >
                    Submit Comment
                  </Button>
                </form>

                <div className="mt-4 flex flex-col gap-4">
                  <h2 className="text-xl">Comments</h2>
                  {comments.length > 0 ? (
                    <div className="space-y-2">
                      {comments.map((c) => (
                        <div
                          key={c.id}
                          className="flex flex-col gap-2 p-4 border border-white rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-[#FFC107]" />
                            <span className="text-white">{c.author}</span>
                            <span className="text-purple-500 text-sm">
                              {new Date(c.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-red-500" />
                            <p className="text-white">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default EventPageClient;
