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
      <div className="w-full min-h-screen bg-black text-white py-12 px-4 md:px-8">
        {eventData.map((event: any) => {
          const isActive = new Date(event.event_startdate) >= new Date();
          return (
            <div key={event.id} className="max-w-7xl mx-auto mt-12">
              <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-8">
                {event.event_title}
              </h1>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Left side - Event Image */}
                <div className="md:w-1/2">
                  <div
                    className="rounded-lg overflow-hidden shadow-lg"
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
                    }}
                  >
                    <div className="p-1">
                      {img.map((i: any) => (
                        <Image
                          key={i}
                          src={i}
                          alt="event image"
                          className="w-full rounded-lg"
                          width={500}
                          height={500}
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side - Event Details */}
                <div className="md:w-1/2">
                  <div className="rounded-lg p-6 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">About The Event</h2>
                    <p className="text-justify leading-relaxed mb-4">
                      {event.event_description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold">Event Starts:</h3>
                        <p>
                          {new Date(event.event_startdate).toLocaleString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Event Ends:</h3>
                        <p>
                          {new Date(event.event_enddate).toLocaleString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Duration:</h3>
                        <p>{event.event_duration} Hours</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Team Size:</h3>
                        <p>{event.team_size}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Location:</h3>
                        <p>{event.event_location}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Price:</h3>
                        <Badge variant="destructive">
                          <span>&#8377;</span>
                          {event.event_price}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      variant="destructive"
                      className={`${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} mb-4`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div className="mb-4">
                      <h3 className="font-semibold">Registration Period:</h3>
                      <p>
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
                        })}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className={`w-full mb-2 transition-transform duration-300 ease-in-out transform ${
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
                    {isRegistered && eventEnded && (
                      <Link href={eventFeedbackLink}>
                        <Button variant="outline" className="w-full mb-2">
                          Submit Feedback
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      className={`w-full ${isRegistered ? "" : "opacity-50 cursor-not-allowed"}`}
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
              </div>

              {/* Additional Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {/* Organizer Card */}
                <div className="rounded-lg p-6 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Organizer</h2>
                  <p>{event.organizer_name}</p>
                  <p>{event.organizer_contact}</p>
                  <p>{event.organizer_email}</p>
                </div>

                {/* Category & Tags Card */}
                <div className="rounded-lg p-6 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Category & Tags</h2>
                  <p className="mb-2">
                    Category:{" "}
                    <Badge variant="secondary">{event.event_category}</Badge>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    Tags:{" "}
                    {tags.map((tag: any) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>

                {/* Social Links Card */}
                <div className="rounded-lg p-6 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Social Links</h2>
                  <div className="flex flex-col gap-2">
                    {social.map((s: any) => (
                      <Link
                        key={s}
                        href={s}
                        target="_blank"
                        rel="noreferrer"
                        className="text-red-500 break-all hover:underline"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Share Event Section */}
              <div className="mt-8 rounded-lg p-6 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                  Share This Event On Socials
                </h2>
                <div className="flex gap-4">
                  <TwitterShareButton
                    url={shareUrl}
                    title={title}
                    className="hover:scale-110 transition-transform transform duration-300 ease-in-out"
                  >
                    <FaXTwitter size={30} />
                  </TwitterShareButton>
                  <WhatsappShareButton
                    url={shareUrl}
                    title={title}
                    className="hover:scale-110 transition-transform transform duration-300 ease-in-out"
                  >
                    <WhatsappIcon size={30} round />
                  </WhatsappShareButton>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-8 rounded-lg p-6 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Comments</h2>
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <textarea
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Leave a comment..."
                    className="w-full bg-gray-800 p-2 border border-gray-700 rounded mb-2"
                    rows={4}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full"
                    disabled={!isAuthenticated}
                  >
                    Submit Comment
                  </Button>
                </form>
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((c) => (
                      <Comment
                        key={c.id}
                        author={c.author}
                        timestamp={c.timestamp}
                        text={c.text}
                      />
                    ))}
                  </div>
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default EventPageClient;
