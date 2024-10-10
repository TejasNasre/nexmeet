"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { supabase } from "../../../../utils/supabase";
import Loading from "@/components/loading";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";

type EventDetails = {
  id: string;
  event_title: string;
  event_description: string;
  event_startdate: string;
  event_enddate: string;
};

type FormData = {
  participant_name: string;
  participant_email: string;
  participant_contact: string;
};

function Registerevent() {
  const params = useParams();
  const { registerId } = params;

  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [submit, setSubmit] : any = useState(null);
  const [isGoogleAuh, setGoogleAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('googleAccessToken');
    const redirectEventDetails = localStorage.getItem("redirect_eventDetails");
    if (redirectEventDetails && JSON.parse(redirectEventDetails).id === registerId) {
      setEventDetails(JSON.parse(redirectEventDetails));
      setSubmit(true);
    }
    if (token) {
      setGoogleAuth(true);
    }
  }, []);

  useEffect(() => {
    async function fetchEventDetails() {
      const { data: event_details, error } = await supabase
        .from("event_details")
        .select("*")
        .eq("id", registerId)
        .single();

      setLoading(false);

      if (error) {
        console.error("Error fetching event details:", error);
        toast.error("Failed to load event details.");
      } else if (event_details) {
        setEventDetails(event_details as EventDetails);
      }
    }
    fetchEventDetails();
  }, [registerId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    setSubmit(false);
    try {
      const { data, error } = await supabase
        .from("event_participants")
        .insert([
          {
            event_id: registerId,
            participant_name: formData.participant_name,
            participant_email: formData.participant_email,
            participant_contact: formData.participant_contact,
            is_registered: true,
          },
        ])
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("No data returned from the insert operation.");
      }

      setSubmit(true);
      localStorage.setItem("eventDetails",JSON.stringify(eventDetails));
      toast.success("Registration successful!");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register. Please try again.");
      setSubmit(null);
    }
  };

  const addToGoogleCalendar = async () => {
    try {
      const accessToken = localStorage.getItem('googleAccessToken');
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const formattedEvent = {
        summary: eventDetails?.event_title,
        description: eventDetails?.event_description,
        startDateTime: eventDetails?.event_startdate,
        endDateTime: eventDetails?.event_enddate
      };

      const response = await fetch('/api/calendar/create-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formattedEvent,
          accessToken,
        }),
      });

      if (response.ok) {
        toast.success("Added To Calendar");
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
      localStorage.removeItem("redirect_eventDetails");
      router.push('/dashboard');
    }
    catch (error: any) {
      console.error('Error creating event:', error);
      if (error.message === 'Not authenticated') {
        localStorage.removeItem('googleAccessToken');
        toast.error('You need to log in again. Redirecting to home page.');
      } else {
        toast.error('Failed to create event. Please try again.');
      }
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    router.push("/unauthorized");
    return null;
  }

  return (
    <div className="w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-wrap w-full gap-10 md:w-2/3"
      >
        {loading ? (
          <h1 className="text-2xl font-extrabold text-center md:text-4xl">
            Loading...
          </h1>
        ) : (
          <h1 className="text-2xl font-extrabold text-center md:text-4xl">
            Registration For{" "}
            <Link
              href={`/explore-events/${registerId}`}
              className="text-red-500"
            >
              {eventDetails?.event_title}
            </Link>
          </h1>
        )}

        <div className="flex flex-col w-full gap-2">
          <label htmlFor="participant_name">Participant Full Name: </label>
          <input
            type="text"
            id="participant_name"
            placeholder="Participant Full Name"
            {...register("participant_name", {
              required: "Full name is required",
              maxLength: { value: 30, message: "Name is too long" }
            })}
            className="w-full p-2 text-white bg-black border border-white rounded-md"
          />
          {errors.participant_name && <span className="text-red-500">{errors.participant_name.message}</span>}
        </div>

        <div className="flex flex-col w-full gap-2">
          <label htmlFor="participant_email">Participant Email: </label>
          <input
            type="email"
            id="participant_email"
            placeholder="Participant Email"
            {...register("participant_email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className="w-full p-2 text-white bg-black border border-white rounded-md"
          />
          {errors.participant_email && <span className="text-red-500">{errors.participant_email.message}</span>}
        </div>

        <div className="flex flex-col w-full gap-2">
          <label htmlFor="participant_contact">Participant Contact: </label>
          <input
            type="tel"
            id="participant_contact"
            placeholder="Participant Contact"
            {...register("participant_contact", { 
              required: "Contact number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid contact number"
              }
            })}
            className="w-full p-2 text-white bg-black border border-white rounded-md"
          />
          {errors.participant_contact && <span className="text-red-500">{errors.participant_contact.message}</span>}
        </div>

        {!submit && (
          <button
            type="submit"
            disabled={submit === false}
            className="w-full p-2 text-white bg-black border border-white rounded-md hover:bg-white hover:text-black"
          >
            {submit === false ? "Submitting..." : "Submit"}
          </button>
        )}

        {submit === true && (
          <button
            type="button"
            disabled={true}
            className="w-full p-2 text-white bg-black border border-white rounded-md"
          >
            Registered!!
          </button>
        )}

        {submit && isGoogleAuh && (
          <button
            onClick={addToGoogleCalendar}
            className="mt-4 w-full  border border-white p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Add to Google Calendar
          </button>
        )}

      </form>
        {submit && !isGoogleAuh && (
          <Link
            href='/api/google/auth'
            className="mt-4 w-full md:w-2/3 border border-white p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 text-center"
          >
            Authorize To Add Event on Google Calendar
          </Link>
        )}
    </div>
  );
}

export default Registerevent;