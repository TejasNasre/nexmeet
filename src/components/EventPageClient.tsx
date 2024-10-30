"use client";

import React, { useState, useEffect, useCallback } from "react";
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

import { PhoneIcon, MailIcon, User, ArrowRight, Tags, Trash } from "lucide-react";
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
  const [registrationStatus, setRegistrationStatus] = useState("Upcoming"); // track status
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<
    { id: string; text: string; author: string; timestamp: string }[]
  >([]);
  const [eventEnded, seteventEnded] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <button onClick={onClose} className="text-black mb-4">Close</button>
          {children}
        </div>
      </div>
    );
  };
  
  useEffect(() => {
    if (eventData.length > 0 && eventData[0].qr_images?.length > 0) {
      // Accessing the first QR image URL in the qr_images array
      setImageUrls([eventData[0].qr_images[0].url]);
      console.log("QR Image URL:", eventData[0].qr_images[0].url);
    }
  }, [eventData]);
  
  

  useEffect(() => {
    if (eventData.length > 0) {
      const currentDate = new Date();
      const registrationStartDate = new Date(
        eventData[0].event_registration_startdate
      );
      const registrationEndDate = new Date(
        eventData[0].event_registration_enddate
      );

      if (currentDate < registrationStartDate) {
        setRegistrationStatus("Upcoming");
      } else if (currentDate > registrationEndDate) {
        setRegistrationStatus("Inactive");
        setRegistrationClosed(true);
      } else {
        setRegistrationStatus("Active");
        setIsRegistrationOpen(true);
      }
    }
  }, [eventData]);

  useEffect(() => {
    async function getData() {
      setIsLoading(true); // Set loading at the start of data fetch
  
      // Fetch event details along with images, participants, and QR images
      let { data, error } = await supabase
        .from("event_details")
        .select(
          "*, event_images(event_id, url), event_participants(participant_email, is_registered), qr_images(event_id, url)"
        )
        .eq("id", eventsId);
  
      if (error) {
        console.error("Error fetching event details:", error);
      } else {
        setEventData(data);
        console.log("Full Event Data with QR Images:", data);
      }
  
      setIsLoading(false); // Set loading to false after data fetch
    }
  
    if (eventsId) {
      getData();
    }
  }, [eventsId]);  

  useEffect(() => {
    async function fetchAndSetEventStatus() {
      const { data, error } = await supabase
        .from("event_details")
        .select("event_enddate")
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
    }

    fetchAndSetEventStatus();
  }, [eventsId]);

  useEffect(() => {
    userDetails().then((res: any) => {
      setUserData(res);
    });
  }, []);

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("event_id", eventsId);

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data);
    }
  }, [eventsId]);

  useEffect(() => {
    fetchComments();
  }, [eventsId, fetchComments]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

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
  const isPaidEvent = eventData[0]?.price_type === "paid";
  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/explore-events/${eventsId}`;
  const title = "Check out this event on Nexmeet";

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

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

  const handleDeleteComment = async (commentId: string) => {
    const commentToDelete = comments.find(c => c.id === commentId);
    if (!commentToDelete) {
        toast.error("Comment not found.");
        return;
    }

    // Check if the comment belongs to the logged-in user
    if (commentToDelete.author !== `${userData?.given_name} ${userData?.family_name}`) {
        toast.error("You can only delete your own comments.");
        return;
    }

    const { error } = await supabase.from("comments").delete().eq("id", commentId);

    if (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment.");
    } else {
      setComments((prevComments) => prevComments.filter(c => c.id !== commentId));
      toast.success("Comment deleted successfully!");
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
          return (
            <div
              className="flex flex-wrap justify-start items-center max-w-6xl"
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
              {/* {isPaidEvent && ( */}
                <Button onClick={handleOpenModal} className="bg-green-500 text-white">
                  Pay Now
                </Button>
              {/* )} */}
              <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {imageUrls.length > 0 ? (
                  <Image src={imageUrls[0]} alt="QR Code" width={200} height={200} />
                ) : (
                  <p>No QR code available</p>
                )}
              </Modal>
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
                          isRegistrationOpen
                            ? "bg-green-100 text-green-800"
                            : !registrationClosed && !isRegistrationOpen
                              ? "bg-blue-200 text-blue-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {registrationStatus}
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
                          !isRegistrationOpen ||
                          (!registrationClosed && !isRegistrationOpen)
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-105"
                        }`}
                        disabled={
                          registrationClosed ||
                          isRegistered ||
                          !isRegistrationOpen ||
                          (!registrationClosed && !isRegistrationOpen)
                        }
                        onClick={isUser}
                      >
                        {registrationClosed
                          ? "Registration Closed"
                          : isRegistered
                            ? "Registered ✔️"
                            : !registrationClosed && !isRegistrationOpen
                              ? "Registration Upcoming"
                              : "Register Now"}
                      </Button>
                    </div>
                    <div>
                      {isRegistered && eventEnded ? (
                        <Link href={`/event-feedback/${eventsId}`}>
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
              <div className="w-full order-2 md:order-none">
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
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-[#FFC107]" />
                            <span className="text-white">{c.author}</span>
                            <span className="text-purple-500 text-sm">
                              {new Date(c.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            className="ml-auto p-2 text-sm border-none" // Adjust padding and font size
                            onClick={() => handleDeleteComment(c.id)} // Trigger delete function
                            >
                            <Trash className="w-4 h-4 text-red-500" /> {/* Use your delete icon here */}
                          </Button>
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
