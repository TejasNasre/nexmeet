"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Loading from "@/components/loading";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";
import { z } from "zod";

const formatDateForDatabase = (inputDate: string): string => {
  const [date, time] = inputDate.split("T");
  return `${date} ${time}:00`;
};

const eventSchema = z.object({
  event_title: z.string().nonempty(),
  event_description: z.string().nonempty(),
  event_location: z.string().nonempty(),
  event_registration_startdate: z.string().nonempty(),
  event_registration_enddate: z.string().nonempty(),
  event_startdate: z.string().nonempty(),
  event_enddate: z.string().nonempty(),
  event_duration: z.number().positive("Duration must be greater than 0"),
  team_size: z.number().positive("Team size must be greater than 0"),
  event_formlink: z.string().url(),
  event_price: z.string().nonempty().regex(/^\d+$/, "Price must be a number")
    .transform(Number).refine((price) => price >= 0, "Price cannot be negative"),
  organizer_name: z.string().nonempty(),
  organizer_email: z.string().email(),
  organizer_contact: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format. It should be a valid international number."),
  event_category: z.string().nonempty(),
  event_tags: z.array(z.string()).nonempty(),
  event_social_links: z.array(z.string()).optional(),
});

interface Event {
  id: string;
  event_title: string;
  event_description: string;
  event_location: string;
  event_registration_startdate: string;
  event_registration_enddate: string;
  event_startdate: string;
  event_enddate: string;
  event_duration: string;
  team_size: string;
  event_formlink: string;
  event_price: string;
  organizer_name: string;
  organizer_email: string;
  organizer_contact: string;
  event_category: string;
  event_tags: string[];
  event_social_links: string[];
}

export default function UpdateEvent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  useEffect(() => {
    if (eventId) {
      fetchEventDetails(eventId);
    }
  }, [eventId]);

  const fetchEventDetails = async (eventId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("event_details")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) {
      console.error("Error fetching event details:", error);
      setErrorMessage("Failed to fetch event details.");
    } else {
      setEvent({
        ...data,
        event_tags: Array.isArray(data.event_tags) ? data.event_tags : [],
        event_social_links: Array.isArray(data.event_social_links) ? data.event_social_links : [],
      });
    }
    setLoading(false);
  };

  const handleUpdateEvent = async () => {
    if (!event) return;

    // Clear previous field errors
    setFieldErrors({});

    try {
      eventSchema.parse({
        ...event,
        event_registration_startdate: formatDateForDatabase(event.event_registration_startdate),
        event_registration_enddate: formatDateForDatabase(event.event_registration_enddate),
        event_startdate: formatDateForDatabase(event.event_startdate),
        event_enddate: formatDateForDatabase(event.event_enddate),
      });

      const updatedEvent = {
        ...event,
        event_registration_startdate: formatDateForDatabase(event.event_registration_startdate),
        event_registration_enddate: formatDateForDatabase(event.event_registration_enddate),
        event_startdate: formatDateForDatabase(event.event_startdate),
        event_enddate: formatDateForDatabase(event.event_enddate),
      };

      const { error } = await supabase
        .from("event_details")
        .update(updatedEvent)
        .eq("id", event.id);

      if (error) {
        console.error("Error updating event:", error);
        toast.error("Error updating event. Please try again.");
      } else {
        setSuccessMessage("Event updated successfully.");
        toast.success("Event updated successfully!");
        setTimeout(() => {
          setSuccessMessage(null);
          router.push(`/explore-events/${event.id}`);
        }, 3000);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newFieldErrors: { [key: string]: string } = {};
        error.errors.forEach((e) => {
          newFieldErrors[e.path[0]] = e.message; // map the error to the field
        });
        setFieldErrors(newFieldErrors);
        toast.error("Please fix the errors in the form.");
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <div className="w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateEvent();
        }}
        className="flex flex-col flex-wrap w-full gap-10 md:w-2/3"
      >
        <h1 className="text-2xl font-extrabold text-center md:text-4xl">Update Event</h1>
        {successMessage && <div className="p-4 mb-4 text-white bg-green-500 rounded">{successMessage}</div>}
        {errorMessage && <div className="p-4 mb-4 text-white bg-red-500 rounded">{errorMessage}</div>}
        {event && (
          <>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_title">Event Title: </label>
              <input
                required
                type="text"
                placeholder="Enter Event Title"
                value={event.event_title}
                onChange={(e) => setEvent({ ...event, event_title: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.event_title && <p className="text-red-500">{fieldErrors.event_title}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_description">Event Description: </label>
              <Textarea
                required
                placeholder="Enter Event Description"
                rows={4}
                value={event.event_description}
                onChange={(e) => setEvent({ ...event, event_description: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.event_description && <p className="text-red-500">{fieldErrors.event_description}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_location">Event Location: </label>
              <input
                required
                type="text"
                placeholder="Enter Event Location"
                value={event.event_location}
                onChange={(e) => setEvent({ ...event, event_location: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.event_location && <p className="text-red-500">{fieldErrors.event_location}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_registration_startdate">Event Registration Start Date: </label>
              <input
                required
                type="datetime-local"
                value={event.event_registration_startdate ? new Date(event.event_registration_startdate).toISOString().slice(0, 16) : ""}
                onChange={(e) => setEvent({ ...event, event_registration_startdate: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.event_registration_startdate && <p className="text-red-500">{fieldErrors.event_registration_startdate}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_registration_enddate">Event Registration End Date: </label>
              <input
                required
                type="datetime-local"
                value={event.event_registration_enddate ? new Date(event.event_registration_enddate).toISOString().slice(0, 16) : ""}
                onChange={(e) => setEvent({ ...event, event_registration_enddate: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.event_registration_enddate && <p className="text-red-500">{fieldErrors.event_registration_enddate}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_startdate">Event Start Date: </label>
              <input
                required
                type="datetime-local"
                value={event.event_startdate ? new Date(event.event_startdate).toISOString().slice(0, 16) : ""}
                onChange={(e) => setEvent({ ...event, event_startdate: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.event_startdate && <p className="text-red-500">{fieldErrors.event_startdate}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_enddate">Event End Date: </label>
              <input
                required
                type="datetime-local"
                value={event.event_enddate ? new Date(event.event_enddate).toISOString().slice(0, 16) : ""}
                onChange={(e) => setEvent({ ...event, event_enddate: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.event_enddate && <p className="text-red-500">{fieldErrors.event_enddate}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_duration">Event Duration (in hours): </label>
              <input
                required
                type="number"
                placeholder="Enter Event Duration"
                value={event.event_duration}
                onChange={(e) => setEvent({ ...event, event_duration: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.event_duration && <p className="text-red-500">{fieldErrors.event_duration}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="team_size">Team Size: </label>
              <input
                required
                type="number"
                placeholder="Enter Team Size"
                value={event.team_size}
                onChange={(e) => setEvent({ ...event, team_size: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.team_size && <p className="text-red-500">{fieldErrors.team_size}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_formlink">Event Form Link: </label>
              <input
                required
                type="url"
                placeholder="Enter Event Form Link"
                value={event.event_formlink}
                onChange={(e) => setEvent({ ...event, event_formlink: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.event_formlink && <p className="text-red-500">{fieldErrors.event_formlink}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_price">Event Price: </label>
              <input
                required
                type="number"
                min="0"
                placeholder="Enter Event Price (INR)"
                value={event.event_price}
                onChange={(e) => setEvent({ ...event, event_price: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              <p>If Free Enter 0</p>
              {fieldErrors.event_price && <p className="text-red-500">{fieldErrors.event_price}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="organizer_name">Organizer Name: </label>
              <input
                required
                type="text"
                placeholder="Enter Organizer Name"
                value={event.organizer_name}
                onChange={(e) => setEvent({ ...event, organizer_name: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.organizer_name && <p className="text-red-500">{fieldErrors.organizer_name}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="organizer_email">Organizer Email: </label>
              <input
                required
                type="email"
                placeholder="Enter Organizer Email"
                value={event.organizer_email}
                onChange={(e) => setEvent({ ...event, organizer_email: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.organizer_email && <p className="text-red-500">{fieldErrors.organizer_email}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
            <label htmlFor="organizer_contact">Organizer Contact: </label>
            <input
                type="tel"
                placeholder="Enter Organizer Contact"
                value={event.organizer_contact || ''}
                onChange={(e) => {
                // Ensure the value is a string
                const value = e.target.value;
                setEvent({ ...event, organizer_contact: value });
                }}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
            />
            {fieldErrors.organizer_contact && <p className="text-red-500">{fieldErrors.organizer_contact}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_category">Event Category: </label>
              <input
                required
                type="text"
                placeholder="Enter Event Category"
                value={event.event_category}
                onChange={(e) => setEvent({ ...event, event_category: e.target.value })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.event_category && <p className="text-red-500">{fieldErrors.event_category}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_tags">Event Tags (comma separated): </label>
              <input
                required
                type="text"
                placeholder="Enter Event Tags"
                value={event.event_tags.join(", ")}
                onChange={(e) => setEvent({ ...event, event_tags: e.target.value.split(",").map(tag => tag.trim()) })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.event_tags && <p className="text-red-500">{fieldErrors.event_tags}</p>}
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="event_social_links">Event Social Links (comma separated): </label>
              <input
                type="text"
                placeholder="Enter Social Links"
                value={event.event_social_links.join(", ")}
                onChange={(e) => setEvent({ ...event, event_social_links: e.target.value.split(",").map(link => link.trim()) })}
                className="w-full p-2 text-white bg-black border border-white rounded-md"
              />
              {fieldErrors.event_social_links && <p className="text-red-500">{fieldErrors.event_social_links}</p>}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="p-2 text-white bg-blue-500 rounded-md">
                  Update Event
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent style={{ backgroundColor: 'rgb(249, 250, 251)', borderRadius: '8px' }}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will update the event details.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="bg-gray-200 hover:bg-red-600 text-black rounded-md px-4 py-2">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                        onClick={handleUpdateEvent}
                        className="bg-gray-200 border hover:bg-green-600 text-black rounded-md px-4 py-2">Update</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </form>
    </div>
  ) : (
    router.push("/unauthorized")
  );
}
