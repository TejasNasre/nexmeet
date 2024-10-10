"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../../../utils/supabase";
import { userDetails } from "../../../../action/userDetails";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useSearchParams } from "next/navigation"; 
import Loading from "@/components/loading";
import { toast } from "sonner";

export default function RequestBooking() {
    const router = useRouter();
    const searchParams = useSearchParams(); 
    const { isAuthenticated, isLoading } = useKindeBrowserClient();
  
    const [user, setUser]: any = useState(null);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  
    useEffect(() => {
      // Fetch user details
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
  
    useEffect(() => {
      // Extract spaceId from the search parameters and set it in the form
      const spaceId = searchParams.get("spaceId");
      if (spaceId) {
        setValue("space_id", spaceId);
      }
    }, [searchParams, setValue]);

    const onSubmit = async (data: any) => {
      const { space_id, request_date, status } = data;
  
      const { error } = await supabase
        .from("event_space_request")
        .insert([{
          organiser_id: user?.id, 
          space_id: space_id, 
          request_date: request_date, 
          status: status || 'pending',  
        }]);
  
      if (error) {
        console.error(error);
        toast.error("Request submission failed. Please try again.");
        return;
      }
  
      toast.success("Booking request submitted successfully!");
      router.push("/"); 
    };
  
    if (isLoading) {
      return <Loading />;
    }
  
    return isAuthenticated ? (
      <div className="w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-wrap w-full gap-10 md:w-2/3">
          <h1 className="text-2xl font-extrabold text-center md:text-4xl">Request Event Space</h1>
  
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="space_id">Space ID: </label>
            <input
              type="text"
              placeholder="Enter Space ID"
              {...register("space_id", { required: true })}
              className="w-full p-2 text-white bg-black border border-white rounded-md"
            />
            {errors.space_id && <span className="text-red-500">Space ID is required</span>}
          </div>
  
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
  
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="organiser_id">Organizer ID: </label>
            <input
              type="text"
              value={user?.id || ''} 
              readOnly
              className="w-full p-2 text-white bg-gray-700 border border-white rounded-md"
            />
          </div>
  
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="status">Status: </label>
            <select
              {...register("status", { required: true })}
              className="w-full p-2 text-white bg-black border border-white rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
            {errors.status && <span className="text-red-500">Status is required</span>}
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
