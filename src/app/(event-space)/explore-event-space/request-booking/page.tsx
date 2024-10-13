"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../../../utils/supabase";
import { userDetails } from "../../../../action/userDetails";
import { useRouter, useSearchParams } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Loading from "@/components/loading";
import { toast } from "sonner";

export default function RequestBooking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const spaceId = searchParams.get("spaceId"); 
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const [user, setUser]: any = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    // Fetch user details and set organiser email
    const fetchUserDetails = async () => {
      try {
        const fetchedUserDetails = await userDetails();
        setUser(fetchedUserDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details");
        setUser(null);
      }
    };

    fetchUserDetails();
  }, []);

  const onSubmit = async (data: any) => {
    const { request_date } = data;

    if (!spaceId) {
      toast.error("Space ID is missing");
      return;
    }

    const { error } = await supabase
      .from("event_space_request")
      .insert([{
        organiser_id: user?.email, 
        space_id: spaceId, 
        request_date: request_date,
        status: 'pending', 
      }]);

    if (error) {
      console.error(error);
      toast.error("Request submission failed. Please try again.");
      return;
    }

    toast.success("Booking request submitted successfully!");
    router.push("/dashboard");
  };

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <div className="w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-wrap w-full gap-10 md:w-2/3">
        <h1 className="text-2xl font-extrabold text-center md:text-4xl">Request Event Space</h1>

        <div className="flex flex-col w-full gap-2">
          <label htmlFor="request_date">Request Date: </label>
          <input
            type="datetime-local"
            placeholder="Select Request Date"
            {...register("request_date", { required: true })}
            className="w-full p-2 text-white bg-black border border-white rounded-md"
          />
          {errors.request_date && <span className="text-red-500">Request date is required</span>}
        </div>

        <button
          type="submit"
          className="w-full p-2 text-white bg-black border border-white rounded-md hover:bg-white hover:text-black"
        >
          Submit Request
        </button>
      </form>
    </div>
  ) : (
    router.push("/unauthorized")
  );
}
