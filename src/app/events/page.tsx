'use client';
import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination";
import data from "../../data/event.json";
import Link from "next/link";
interface EventData {
  id: number;
  title: string;
  description: string;
  categories: string[];
  image: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  participants: string[];
  seats: number;
  websiteLink: string;
  price: number;
  status: "active" | "upcoming" | "inactive";
  tags: string[];
}

function getData() {
  const response = data;
  return response;
}

const Page: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");

  const eventData = getData().filter((event) => {
    return (
      (selectedStatus === "all" || event.status === selectedStatus) &&
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = eventData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(eventData.length / itemsPerPage);

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
              placeholder="Search"
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
          {/* <select
            className="w-[8rem] bg-black text-start text-white border border-white outline-black rounded-md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="done">Done</option>
          </select> */}
        </div>
        <div className="w-full flex flex-wrap gap-5 justify-evenly">
          {currentItems.length > 0 ? (
            currentItems.map((event) => (

              <Link
                href={`/events/${event.id}`}
                className="w-[350px] group relative block overflow-hidden rounded-lg shadow-lg transition duration-500 hover:shadow-xl text-white border border-white my-5"
                key={event.id}
              >

                <img

                  src={event.image}
                  alt={event.title}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                />

                <div className="relative bg-black p-6 text-white h-full">
                  <span className="whitespace-nowrap bg-green-600 text-white rounded-md px-3 py-1.5 text-xs font-medium">
                    {/* {event.status} */} {status}
                  </span>

                  <h3 className="mt-4 text-lg font-medium">{event.title}</h3>

                  <p className="mt-1.5 text-sm">$ {event.description}</p>

                  <div className="card-actions justify-end">
                    <div className="badge badge-outline flex gap-2">
                      {/* <HiCreditCard /> */}
                      {event.price}
                    </div>
                    <div className="badge badge-outline flex gap-2">
                      {/* <FaLocationDot /> */}
                      {event.location}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="h-screen flex flex-col justify-center items-center text-3xl font-bold">
              Event Not Found
            </div>
          )}
        </div>
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
