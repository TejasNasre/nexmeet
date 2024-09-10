"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { supabase } from "../../../../utils/supabase";
import Link from "next/link";

function Registerevent() {
  const [loading, setLoading]: any = useState(true);
  const [eventDetails, setEventDetails]: any = useState([]);
  const [submit, setSubmit]: any = useState(null);
  const params = useParams();
  const { registerId } = params;

  useEffect(() => {
    async function fetchEventDetails() {
      let { data: event_details, error } = await supabase
        .from("event_details")
        .select("*")
        .eq("id", registerId);
      setLoading(false);

      if (event_details) {
        setEventDetails(event_details[0]);
      }
    }
    fetchEventDetails();
  }, [registerId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (event_participants: any) => {
    setSubmit(false);
    const { data, error } = await supabase
      .from("event_participants")
      .insert([
        {
          event_id: registerId,
          participant_name: event_participants.participant_name,
          participant_email: event_participants.participant_email,
          participant_contact: event_participants.participant_contact,
        },
      ])
      .select();
    setSubmit(true);

    if (error) {
      console.error(error);
      return;
    }

    if (data.length === 0) {
      console.error("No data returned from the insert operation.");
      return;
    }

    // router.push(`/events/${data[0].id}`);
  };

  return (
    <>
      <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col flex-wrap gap-10 md:w-2/3"
        >
          {loading ? (
            <h1 className="text-2xl md:text-4xl font-extrabold text-center">
              Loading...
            </h1>
          ) : (
            <h1 className="text-2xl md:text-4xl font-extrabold text-center">
              Registration For{" "}
              <Link
                href={`/explore-events/${registerId}`}
                className="text-red-500"
              >
                {eventDetails.event_title}
              </Link>
            </h1>
          )}

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="event_title">Participant Full Name: </label>
            <input
              type="text"
              placeholder="Participant Full Name"
              {...register("participant_name", {
                required: true,
                max: 30,
                maxLength: 31,
              })}
              className="w-full border border-white p-2 rounded-md bg-black text-white"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="event_title">Participant Email: </label>
            <input
              type="email"
              placeholder="Participant Email"
              {...register("participant_email", { required: true })}
              className="w-full border border-white p-2 rounded-md bg-black text-white"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="event_title">Participant Contact: </label>
            <input
              type="tel"
              placeholder="Participant Contact"
              {...register("participant_contact", { required: true })}
              className="w-full border border-white p-2 rounded-md bg-black text-white"
            />
          </div>

          <button
            type="submit"
            disabled={submit === false}
            className="w-full border border-white p-2 rounded-md bg-black text-white hover:bg-white hover:text-black"
          >
            {submit === false ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Registerevent;
