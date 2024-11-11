"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { supabase } from "../../../../utils/supabase";
import Loading from "@/components/loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";

function Registerevent() {
  const params = useParams();
  const { registerId } = params as { registerId: string };

  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const [loading, setLoading]: any = useState(true);
  const [eventDetails, setEventDetails]: any = useState([]);
  const [submit, setSubmit]: any = useState(null);
  const [pamenturl, setPaymenturl] = useState("");

  useEffect(() => {
    async function fetchEventDetails() {
      let { data: event_details, error } = await supabase
        .from("event_details")
        .select("*")
        .eq("id", registerId);
      setLoading(false);

      if (event_details) {
        setEventDetails(event_details[0]);
        // console.log(event_details[0]);
        const upiData = `upi://pay?pa=${event_details[0].upi_id}&pn=${event_details[0].account_holder_name}&am=${event_details[0].event_amount}&cu=INR`;
        setPaymenturl(upiData);
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
          transaction_id: event_participants.transaction_id,
          account_holder_name: event_participants.account_holder_name,
          is_registered: true,
        },
      ])
      .select();
    setSubmit(true);

    if (error) {
      console.error(error);
      toast.error("Failed to register.");
      return;
    }

    if (data.length === 0) {
      console.error("No data returned from the insert operation.");
      toast.error("No data returned after registration.");
      return;
    }

    // Send registration email
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "registration",
          eventDetails: {
            ...eventDetails,
            event_startdate: eventDetails.event_startdate.toString(),
            event_enddate: eventDetails.event_enddate.toString(),
          },
          participant: event_participants,
        }),
      });
      toast.success("Registration email sent successfully!");
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
      toast.error("Failed to send registration email");
    }

    toast.success("Registration successful!");
    router.push(`/dashboard`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <>
      <div className="  w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
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
                {eventDetails.event_title}
              </Link>
            </h1>
          )}

          <div className="flex flex-col w-full gap-2">
            <label htmlFor="event_title">Participant Full Name: </label>
            <input
              type="text"
              placeholder="Participant Full Name"
              {...register("participant_name", {
                required: true,
                max: 30,
                maxLength: 31,
              })}
              className="w-full p-2 text-white bg-black border border-white rounded-md"
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="event_title">Participant Email: </label>
            <input
              type="email"
              placeholder="Participant Email"
              {...register("participant_email", { required: true })}
              className="w-full p-2 text-white bg-black border border-white rounded-md"
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="event_title">Participant Contact: </label>
            <input
              type="tel"
              placeholder="Participant Contact"
              {...register("participant_contact", {
                required: true,
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Contact number must be 10 to 15 digits",
                },
              })}
              className="w-full p-2 text-white bg-black border border-white rounded-md"
            />
            {errors.participant_contact && (
              <span style={{ color: "red" }}>Invalid contact number</span>
            )}
          </div>
          {eventDetails.isEventFree === "free" ? (
            <>
              <h1>
                This Event Is Free No Need To Pay Any Amount Directly Register
              </h1>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <h1 className="text-red-600">*This Event Is Paid</h1>
                <div className="bg-white md:w-[300px] flex flex-col justify-center items-center gap-6 p-2 md:px-10 md:py-4">
                  <h1 className="text-black text-2xl">UPI QR-CODE</h1>
                  <QRCodeCanvas value={`${pamenturl}`} size={250} />
                </div>
                <h1>
                  Pay{" "}
                  <span className="text-red-600 underline">
                    {eventDetails.event_amount}
                  </span>{" "}
                  INR To Above QR-Code And Enter The Transaction ID Below
                </h1>
              </div>

              <div className="flex flex-col w-full gap-2">
                <label htmlFor="transaction_id">UPI Transaction ID: </label>
                <input
                  type="text"
                  placeholder="UPI Transaction ID"
                  {...register("transaction_id", { required: true })}
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              </div>

              <div className="flex flex-col w-full gap-2">
                <label htmlFor="account_holder_name">
                  Account Holder Name:{" "}
                </label>
                <input
                  type="text"
                  placeholder="Account Holder Name"
                  {...register("account_holder_name", { required: true })}
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              </div>
            </>
          )}

          <Button type="submit" disabled={submit === false}>
            {submit === false ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </>
  ) : (
    router.push("/unauthorized")
  );
}

export default Registerevent;
