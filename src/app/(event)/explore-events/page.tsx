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
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [numberOfLikes, setNumberOfLikes] = useState("0");
  const [searchTerm, setSearchTerm] = useState("");
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
        // console.log(data);
        // console.log(data[0].event_images[0].url);
      }
      setLoading(false);
    }
    getData();
  }, []);

  const eventData = event.filter((event: any) => {
    const date = new Date(event.event_startdate);
    return (
      parseInt(numberOfLikes) * 50 <= event.likes &&
      (event.event_title.toLowerCase().includes(searchTerm.toLowerCase()) 
        || event.event_category.includes(searchTerm.toLowerCase())
        || event.event_location.toLowerCase().includes(searchTerm.toLowerCase())) &&      
      (startDate == null || new Date(startDate) < date) &&
      (endDate == null || date < new Date(endDate))
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = eventData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(eventData.length / itemsPerPage);

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
      <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem] px-[2rem]">
        <div className="text-center my-10 text-4xl font-bold">
          Explore Events
        </div>
        <div className="w-full my-[3rem] flex flex-row gap-4 justify-end">
          <label className="input input-bordered flex items-center gap-2 bg-black border border-white w-full">
            <input
              type="text"
              className="text-white grow w-full"
              placeholder="Search Name, Category or Location"
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
          <DatePicker
            className="date-picker w-full border border-white p-2 rounded-md bg-black text-white h-12"
            selected={startDate}
            onChange={(date) => date && handleStartDateChange(date)}
            placeholderText="Start Date"
          />
          <DatePicker
            className="date-picker w-full border border-white p-2 rounded-md bg-black text-white h-12"
            selected={endDate}
            onChange={(date) => date && handleEndDateChange(date)}
            placeholderText="End Date"
            minDate={startDate} // Prevent end date from being before start date
          />
          {
            <select
              className="w-[8rem] bg-black text-start text-white border border-white outline-black rounded-md"
              value={numberOfLikes}
              onChange={(e) => setNumberOfLikes(e.target.value)}
            >
              <option value={0}>Likes</option>
              <option value={1}>50+</option>
              <option value={2}>100+</option>
              <option value={3}>150+</option>
            </select>
          }
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="w-full flex flex-wrap gap-5 justify-evenly py-[4rem]">
              {eventData.length > 0 ? (
                eventData.map((event: any) => (
                  <div
                    className="cursor-pointer w-[350px] mx-auto bg-black text-white rounded-xl shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
                    key={event.id}
                  >
                    <div className="relative h-64">
                      <Image
                        width="500"
                        height="500"
                        src={event.event_images[0]?.url[0]}
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
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {event.event_category}
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
                          <span className="truncate">
                            Silicon Valley Conference Center, SF
                          </span>
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
                ))
              ) : (
                <div className="h-screen flex flex-col justify-center items-center text-3xl font-bold">
                  Event Not Found
                </div>
              )}
            </div>
          </>
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
