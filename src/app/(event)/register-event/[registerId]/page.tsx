"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { supabase } from "../../../../utils/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import ConfirmationDialog from "../../../../components/ConfirmationDialog";
function Registerevent() {
  const router = useRouter();
  const [loading, setLoading]: any = useState(true);
  const [eventDetails, setEventDetails]: any = useState([]);
  const [submit, setSubmit]: any = useState(null);
  const params = useParams();
  const { registerId } = params;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const handleRegistrationSubmit = (event:any) => {
    // Logic to submit registration details
event.preventDefault();
    // Show the confirmation dialog after submitting
    setShowConfirmation(true);
  };
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
  const handleConfirmation = (confirmed:any) => {
    if (confirmed) {
      // Perform registration
      setIsRegistered(true);
      router.push('/dashboard')
    } else {
      // Cancel registration
      setIsRegistered(false);
    }

    // Hide the confirmation dialog
    setShowConfirmation(false);
  };
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

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
        <form
          onSubmit={handleRegistrationSubmit}
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
        {showConfirmation && (
        <ConfirmationDialog
          message="Do you want to confirm the registration?"
          onConfirm={() =>handleConfirmation(true)}
          onCancel={() =>handleConfirmation(false)}
        />
      )}
       {isRegistered && <p>Registration successful!</p>}
      </div>
    </>
  );
}

export default Registerevent;
