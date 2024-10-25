"use client";
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { supabase } from "../../utils/supabase";
import Loading from "../loading";
import { Calendar as CalendarIcon, X } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface Event {
  event_id: string | number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

const EventCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState<"month" | "week" | "work_week" | "day" | "agenda">("month");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("event_details")
      .select(
        "id, event_title, event_startdate, event_enddate, event_description"
      );

    if (error) {
      console.error("Error fetching events:", error);
    } else {
      const formattedEvents = data.map((event) => ({
        event_id: event.id,
        title: event.event_title,
        start: new Date(event.event_startdate),
        end: new Date(event.event_enddate || event.event_startdate),
        description: event.event_description,
      }));
      setEvents(formattedEvents);
    }
    setLoading(false);
  };

  const generateCalendarFile = (event: Event) => {
    const formatDate = (date: Date) =>
      date.toISOString().replace(/-|:|\.\d+/g, "");
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${formatDate(event.start)}`,
      `DTEND:${formatDate(event.end)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ""}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addToGoogleCalendar = (event: Event) => {
    const startTime = event.start.toISOString().replace(/-|:|\.\d+/g, "");
    const endTime = event.end.toISOString().replace(/-|:|\.\d+/g, "");
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${startTime}/${endTime}&details=${encodeURIComponent(
      event.description || ""
    )}`;
    window.open(url, "_blank");
  };

  const getRandomGradient = () => {
    const gradients = [
      "from-purple-500 to-pink-500",
      "from-yellow-400 to-orange-500",
      "from-green-400 to-blue-500",
      "from-indigo-500 to-purple-500",
      "from-red-500 to-yellow-500",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const handleNavigate = (newDate: Date) => setDate(newDate);

  const handleViewChange = (newView: typeof Views[keyof typeof Views]) => setView(newView);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-auto bg-black text-white py-[8rem] px-4 flex flex-col">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="my-10 text-3xl font-bold text-center">
          Edit Your Events
        </h1>
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-lg shadow-lg w-full max-w-6xl">
          <div className="bg-black rounded-lg p-4">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}
              onSelectEvent={handleSelectEvent}
              view={view}
              onView={handleViewChange}
              date={date}
              onNavigate={handleNavigate}
              views={["month", "week", "day"]}
              className="custom-calendar"
              components={{
                event: (props) => (
                  <div className="text-white">
                    {props.title}
                  </div>
                ),
              }}
            />
          </div>
        </div>
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl relative w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
                <button
                  onClick={closeEventDetails}
                  className="absolute top-7 right-5 text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
                <h3
                  className={`text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r ${getRandomGradient()} bg-clip-text text-transparent`}
                >
                  {selectedEvent.title}
                </h3>
                <p className="text-gray-300 mb-3 text-sm sm:text-base">
                  {moment(selectedEvent.start).format("LLLL")} -{" "}
                  {moment(selectedEvent.end).format("LLLL")}
                </p>
                {selectedEvent.description && (
                  <p className="text-gray-400 mb-4 text-sm sm:text-base">
                    {selectedEvent.description}
                  </p>
                )}
              </div>
              <div className="p-4 bg-gray-800 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => addToGoogleCalendar(selectedEvent)}
                  className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm"
                >
                  <CalendarIcon className="mr-2" size={16} />
                  Add to Google Calendar
                </button>
                <button
                  onClick={() => generateCalendarFile(selectedEvent)}
                  className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm"
                >
                  <CalendarIcon className="mr-2" size={16} />
                  Add to Apple Calendar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendarPage;