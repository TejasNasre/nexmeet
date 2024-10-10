"use client";
import React, { useState, useEffect } from "react";
import Pagination from "../../../components/Pagination";
import { supabase } from "../../../utils/supabase";
import Link from "next/link";
import Image from "next/image";
import Loading from "../../../components/loading";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Page: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [event, setEvent]: any = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [numberOfLikes, setNumberOfLikes] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

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
  }, []);

  const sortEventsByLikes = (events: any[]) => {
    if (numberOfLikes === "high") {
      return events.sort((a, b) => b.event_likes - a.event_likes);
    } else if (numberOfLikes === "low") {
      return events.sort((a, b) => a.event_likes - b.event_likes);
    }
    return events;
  };

  const filteredAndSortedEvents = sortEventsByLikes(event).filter(
    (event: any) => {
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
    }
  );

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
        className={`  w-full h-auto bg-black text-white py-[8rem] ${
          loading ? `px-0` : `px-4`
        }`}
      >
        <div className="text-center my-10 text-4xl font-bold">
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
                className="w-[8rem] border border-white p-2 rounded-md bg-black text-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Category</option>
                <option value="technical">Technical</option>
                <option value="sports">Sports</option>
                <option value="cultural">Cultural</option>
                <option value="meetup">Meetup</option>
                <option value="conference">Conference</option>
              </select>
              <select
                className="w-[10rem] border border-white p-2 rounded-md bg-black text-white"
                value={numberOfLikes}
                onChange={(e) => setNumberOfLikes(e.target.value)}
              >
                <option value="all">Likes</option>
                <option value="high">Highest Like</option>
                <option value="low">Lowest Likes</option>
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="w-full flex flex-wrap gap-5 justify-evenly py-[4rem]">
            {currentItems.length > 0 ? (
              currentItems.map((event: any) => {
                const isActive = new Date(event.event_startdate) >= new Date();
                return (
                  <div
                    className="cursor-pointer w-[350px] mx-auto bg-black text-white rounded-xl shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
                    key={event.id}
                  >
                    <div className="relative h-64">
                      <Image
                        width="500"
                        height="500"
                        src={JSON.parse(event.event_images[0]?.url)[0]}
                        alt={event.event_title}
                        className="w-full h-full object-cover"
                      />
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
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </span>
                        <span className="text-sm font-semibold">
                          ${event.event_price}
                        </span>
                      </div>
                      <p className="text-xs mb-3 line-clamp-2">
                        {event.event_description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-xs">
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            {" "}
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
                          <MapPinIcon className="h-3 w-3" />
                          <span className="truncate">{event.event_location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <Link href={`/explore-events/${event.id}`}>
                        <button className="w-full bg-black border text-white text-sm font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                )
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
