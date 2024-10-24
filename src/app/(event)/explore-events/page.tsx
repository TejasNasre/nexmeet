"use client";
import React, { useState, useEffect } from "react";
import { useUserDetails } from "../../../hooks/useUserDetails"; // Adjust the import path
import Pagination from "../../../components/Pagination";
import { supabase } from "../../../utils/supabase";
import Link from "next/link";
import Image from "next/image";
import Loading from "../../../components/loading";
import { HeartIcon } from "@heroicons/react/solid";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

const Page: React.FC = () => {
  interface CountLikes {
    [key: string]: number; // Maps event id to its like count
  }

  const [loading, setLoading] = useState(true);
  const [event, setEvent]: any = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [numberOfLikes, setNumberOfLikes] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sortByPrice, setSortByPrice] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [likedEvents, setLikedEvents] = useState<{ [key: string]: boolean }>(
    {}
  );
  const session = useSession();
  const [countLikes, setCountLikes] = useState<CountLikes>({});
  const { user } = useUserDetails();
  interface Event {
    id: string; // or number, based on your actual id type
    event_likes: number;
  }

  useEffect(() => {
    async function getData() {
      let { data, error }: any = await supabase
        .from("event_details")
        .select("*,event_images(event_id,url)");
      if (error) {
        console.error("Error fetching event details:", error);
      } else {
        setEvent(data);
      }
      setLoading(false);
    }
    getData();
  }, []); // Fetch Event Details

  useEffect(() => {
    const fetchLikedEvents = async () => {
      if (user) {
        const userid = user.id;
        const useremail = user.email;
        const { data: likedEventsData, error } = await supabase
          .from("check_event_likes")
          .select("eventid")
          .eq("useremail", useremail);

        if (error) {
          console.error("Error fetching liked events:", error);
          return;
        }

        const likedeventids = likedEventsData.map((item) => item.eventid);
        const likedEventsMap = likedeventids.reduce(
          (acc, id) => {
            acc[id] = true; // Mark liked events as true
            return acc;
          },
          {} as { [key: string]: boolean }
        );

        setLikedEvents(likedEventsMap); // Update the liked events state
      }
    };

    fetchLikedEvents();
  }, [user]); // Fetch liked events whenever the user changes

  const sortEventsByLikes = (events: any[]) => {
    if (numberOfLikes === "high") {
      return events.sort((a, b) => b.event_likes - a.event_likes);
    } else if (numberOfLikes === "low") {
      return events.sort((a, b) => a.event_likes - b.event_likes);
    }
    return events;
  };

  useEffect(() => {
    // Fetch initial like counts for all events when the component mounts
    const fetchLikeCounts = async () => {
      const { data, error } = await supabase
        .from("event_details") // Specify the table name only
        .select("id, event_likes");

      if (error) {
        console.error("Error fetching event likes:", error);
      } else if (data) {
        const likesMap: CountLikes = {}; // Use the CountLikes interface
        data.forEach((event: Event) => {
          likesMap[event.id] = event.event_likes; // Create a map of eventId to like counts
        });
        setCountLikes(likesMap); // Set the initial state with all event likes
      }
    };

    fetchLikeCounts();
  }, []);

  const handleLikeToggle = async (eventid: string) => {
    // Get the user details via the hook // Assuming you're using this hook to get user details
    if (!user) {
      console.log("User is not authenticated. Cannot like the event.");
      toast.error("You are not logged in, Cannot like the event");
      return;
    }

    const userid = user.id;
    const useremail = user.email; // Get user ID from the hook

    // Check if the event is liked by the user
    const { data: likedData, error: checkError } = await supabase
      .from("check_event_likes")
      .select("eventid")
      .eq("eventid", eventid)
      .eq("useremail", useremail);

    if (checkError) {
      console.error("Error checking likes:", checkError);
      return;
    }

    const isLiked = likedData.length > 0;

    // Declare eventData outside the blocks to reuse it
    let eventData;

    // Fetch the current like count for the event
    const { data: fetchedEventData, error: eventError } = await supabase
      .from("event_details")
      .select("event_likes")
      .eq("id", eventid)
      .single();

    if (eventError) {
      console.error("Error fetching event likes:", eventError);
      return;
    }

    eventData = fetchedEventData; // Assign the fetched event data

    if (isLiked) {
      // If the event is liked, unlike it
      const { error: unlikeError } = await supabase
        .from("check_event_likes")
        .delete()
        .eq("eventid", eventid)
        .eq("useremail", useremail);

      if (unlikeError) {
        console.error("Error unliking event:", unlikeError);
        return;
      }

      // Decrease the like count in event_details
      const newLikesCount = eventData.event_likes - 1;

      const { error: decrementError } = await supabase
        .from("event_details")
        .update({ event_likes: newLikesCount })
        .eq("id", eventid);

      if (decrementError) {
        console.error("Error decreasing like count:", decrementError);
        return;
      }
      // Update the countLikes state
      setCountLikes((prevCount) => ({
        ...prevCount,
        [eventid]: newLikesCount,
      }));
    } else {
      // If the event is not liked, like it
      const { error: likeError } = await supabase
        .from("check_event_likes")
        .insert({ eventid, useremail });

      if (likeError) {
        console.error("Error liking event:", likeError);
        return;
      }

      // Increase the like count in event_details
      const newLikesCount = eventData.event_likes + 1;

      const { error: incrementError } = await supabase
        .from("event_details")
        .update({ event_likes: newLikesCount })
        .eq("id", eventid);

      if (incrementError) {
        console.error("Error increasing like count:", incrementError);
        return;
      }
      setCountLikes((prevCount) => ({
        ...prevCount,
        [eventid]: newLikesCount,
      }));
    }

    // Update the local state in UI to reflect the liked/unliked status
    setLikedEvents((prevLikes) => ({
      ...prevLikes,
      [eventid]: !isLiked,
    }));
  };

  const filteredAndSortedEvents = (() => {
    const filteredEvents = event.filter((event: any) => {
      const date = new Date(event.event_startdate);

      // Check if the event matches the category
      const matchesCategory = category
        ? event.event_category === category
        : true;

      // Check if the event matches the search term in title, category, or location
      const matchesSearchTerm =
        event.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.event_location.toLowerCase().includes(searchTerm.toLowerCase());

      // Check if the event is within the date range
      const withinDateRange =
        (startDate == null || new Date(startDate) < date) &&
        (endDate == null || date < new Date(endDate));

      // Return true if the event matches the category and matches the search term and is within the date range
      return matchesCategory && matchesSearchTerm && withinDateRange;
    });

    if (numberOfLikes === "high") {
      return filteredEvents.sort((a, b) => b.event_likes - a.event_likes);
    } else if (numberOfLikes === "low") {
      return filteredEvents.sort((a, b) => a.event_likes - b.event_likes);
    } else if (sortByPrice === "high") {
      return filteredEvents.sort((a, b) => b.event_price - a.event_price);
    } else if (sortByPrice === "low") {
      return filteredEvents.sort((a, b) => a.event_price - b.event_price);
    }

    return filteredEvents;
  })();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedEvents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);

  const handleStartDateChange = (date: Date) => {
    setStartDate(date); // Update the start date
    if (endDate && date > endDate) {
      setEndDate(undefined); // Reset the end date if it's before the start date
    }
    return date;
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date); // Update the end date
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages, currentPage]);

  return (
    <>
      <div
        className={`w-full h-auto bg-black text-white py-[8rem] ${
          loading ? `px-0` : `px-4`
        }`}
      >
        <div className="text-5xl md:text-6xl font-bold mb-12 text-center tracking-tight">
          Explore Events
        </div>
        <div className="w-full my-[3rem] flex flex-col gap-4 justify-end">
          <div>
            <label className="flex items-center gap-2 bg-black border border-white w-full rounded-md px-4">
              <input
                type="text"
                className="bg-black text-white w-full p-2 rounded-md border-0 outline-none"
                placeholder="Search Name Or Location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>

          <div className="w-full flex justify-end items-center flex-col md:flex-row gap-4">
            <div className="flex flex-row justify-center gap-4">
              <DatePicker
                className="date-picker w-[8rem] border border-white p-2 rounded-md bg-black text-white"
                selected={startDate}
                onChange={(date) => date && handleStartDateChange(date)}
                placeholderText="Start Date"
              />
              <DatePicker
                className="date-picker w-[8rem] border border-white p-2 rounded-md bg-black text-white"
                selected={endDate}
                onChange={(date) => date && handleEndDateChange(date)}
                placeholderText="End Date"
                minDate={startDate} // Prevent end date from being before start date
              />
            </div>{" "}
            <div className="flex flex-row justify-center gap-4">
              <select
                className="w-[10rem] border border-white p-2 rounded-md bg-black text-white"
                value={numberOfLikes}
                onChange={(e) => setNumberOfLikes(e.target.value)}
              >
                <option value="all">Likes</option>
                <option value="high">Highest Likes</option>
                <option value="low">Lowest Likes</option>
              </select>
              <select
                className="w-[11rem] border border-white p-2 rounded-md bg-black text-white"
                value={sortByPrice}
                onChange={(e) => setSortByPrice(e.target.value)}
              >
                <option value="">Price</option>
                <option value="low">Lowest Price</option>
                <option value="high">Highest Price</option>
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="w-full flex flex-wrap gap-5 justify-evenly py-[8rem]">
            {currentItems.length > 0 ? (
              currentItems.map((event: any) => {
                const isActive = new Date(event.event_startdate) >= new Date();
                return (
                  <div
                    className="cursor-pointer w-[350px] mx-auto bg-black text-white rounded-xl shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
                    key={event.id}
                  >
                    <div className="relative h-64">
                      {event.event_images[0]?.url && (
                        <Image
                          width="500"
                          height="500"
                          src={JSON.parse(event.event_images[0].url)[0]}
                          alt={event.event_title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 right-2 z-10">
                        <div className="flex flex-col items-center justify-center p-2 ">
                          <HeartIcon
                            onClick={() => handleLikeToggle(event.id)}
                            className={`h-8 w-8 transition-all duration-300 bg-black rounded-full ${
                              likedEvents[event.id]
                                ? "text-red-500 filter drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                                : "text-white"
                            } hover:text-red-500 backdrop-filter backdrop-blur-sm p-1`}
                          />
                          <span className="text-[14px] font-semibold text-white mt-1">
                            {countLikes[event.id] || 0}
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h2 className="text-lg font-bold leading-tight text-white">
                          {event.event_title}
                        </h2>
                      </div>
                    </div>
                    <div className="p-4 text-white">
                      <div className="flex justify-between items-start mb-2">
                        <span className="flex gap-3">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            {event.event_category}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </span>
                        <span className="text-sm font-semibold text-yellow-500">
                          ${event.event_price}
                        </span>
                      </div>
                      <p className="text-xs mb-3 line-clamp-2">
                        {event.event_description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs">
                          <CalendarIcon className="h-3 w-3" />
                          <span className="text-sm font-semibold text-orange-500">
                            {new Date(event.event_startdate).toLocaleString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <MapPinIcon className="h-3 w-3 text-red-500 flex-shrink-0" />
                          <span className="truncate max-w-[250px]">
                            {event.event_location.length > 50
                              ? `${event.event_location.substring(0, 50)}...`
                              : event.event_location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <Link href={`/explore-events/${event.id}`}>
                        <button className="w-full bg-black border text-teal-500 text-sm font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-screen flex flex-col justify-center items-center text-3xl font-bold">
                Event Not Found
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-[3rem]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
