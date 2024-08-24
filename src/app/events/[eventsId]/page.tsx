"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import data from "../../../data/event.json";
// import Timer from "@/components/Timer";
import Loading from "../../../components/loading";


// interface TimerData {
//   start_date: string;
//   end_date: string;
// }

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

function EventsId() {
  const params = useParams();
  const eventsId = params.eventsId as string;
  const [eventData, seteventData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    setIsLoading(true); // Start loading
    const response: any = data.filter((item) => item.id === eventsId);
    seteventData(response);
    setIsLoading(false); // End loading
  }, [eventsId]);

  if (isLoading) {
    return <Loading />; // Display loading indicator if data is loading
  }

  return (
    <>
      <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem] px-[2rem]">
        {eventData.map((event: EventData) => (
          <div className="flex flex-row p-10" key={event.id}>
            <div className="w-[60%] p-10">
              <img
                src={event.image}
                alt={event.title}
                className="w-full rounded-md"
              />
            </div>
            <div className="p-10 rounded-md flex flex-col gap-4">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <p>Company Name: {event.description}</p>
              <p>Location: {event.location}</p>
              <p>Carbon Credits: {event.location}</p>
              <p>Amount Raised: ${event.seats}</p>
              <p>Emission Reduction: {event.websiteLink}</p>
              <div className="bg-green-600 text-white rounded-md text-center w-[5rem] p-2 text-xs font-medium">
                {event.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default EventsId;
