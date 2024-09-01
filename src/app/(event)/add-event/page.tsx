"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../../utils/supabase";
import { useRef, ChangeEvent, useState, useTransition, useEffect } from "react";
import { convertBlobUrlToFile } from "../../../action/convertBlobUrlToFile";
import { uploadImage } from "../../../action/uploadSupabase";
import { userDetails } from "../../../action/userDetails";
import Image from "next/image";

export default function AddEvent() {
  const [user, setUser]: any = useState(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    userDetails()
      .then((res: any) => {
        setUser(res);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setUser(null);
      });
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      setImageUrls([...imageUrls, ...newImageUrls]);
    }
  };

  const onSubmit = async (event_details: any) => {
    // console.log(event_details);
    const { data, error } = await supabase
      .from("event_details")
      .insert([
        {
          event_title: event_details.event_title,
          event_description: event_details.event_description,
          event_location: event_details.event_location,
          event_registration_startdate:
            event_details.event_registration_startdate,
          event_registration_enddate: event_details.event_registration_enddate,
          event_startdate: event_details.event_startdate,
          event_enddate: event_details.event_enddate,
          event_duration: event_details.event_duration,
          team_size: event_details.team_size,
          event_formlink: event_details.event_formlink,
          event_price: event_details.event_price,
          organizer_name: event_details.organizer_name,
          organizer_email: user?.email,
          organizer_contact: event_details.organizer_contact,
          event_category: event_details.event_category,
          event_tags: event_details.event_tags.split(","),
          event_social_links: event_details.event_social_links.split(","),
        },
      ])
      .select();

    if (error) {
      console.error(error);
      return;
    }

    if (data.length === 0) {
      console.error("No data returned from the insert operation.");
      return;
    }

    startTransition(async () => {
      let urls = [];
      for (const url of imageUrls) {
        const imageFile = await convertBlobUrlToFile(url);

        const { imageUrl, error } = await uploadImage({
          file: imageFile,
          bucket: "event_image",
        });

        if (error) {
          console.error(error);
          return;
        }

        urls.push(imageUrl);
        // console.log(imageUrl);
      }
      const { data: imageData, error: imageError }: any = await supabase
        .from("event_images")
        .insert([
          {
            event_id: data[0].id,
            url: urls,
          },
        ])
        .select();
      setImageUrls([]);
    });
  };

  return (
    <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col flex-wrap gap-10 md:w-2/3"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="event_title">Event Title: </label>
          <input
            type="text"
            placeholder="event_title"
            {...register("event_title", { required: true, max: 999, min: 39 })}
            className="-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event_description">Event Description: </label>
          <textarea
            placeholder="event_description"
            {...register("event_description", {
              required: true,
              max: 999,
              min: 39,
            })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event_location">Event Location: </label>
          <input
            type="text"
            placeholder="event_location"
            {...register("event_location", {
              required: true,
              max: 999,
              min: 38,
            })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event_registration_startdate">
            Event Registration Start Date:{" "}
          </label>
          <input
            type="datetime-local"
            placeholder="event_registration_startdate"
            {...register("event_registration_startdate", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event_registration_enddate">
            Event Registration Start Date:{" "}
          </label>
          <input
            type="datetime-local"
            placeholder="event_registration_enddate"
            {...register("event_registration_enddate", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event_startdate">Event Start Date: </label>
          <input
            type="datetime-local"
            placeholder="event_startdate"
            {...register("event_startdate", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event_enddate">Event End Date: </label>
          <input
            type="datetime-local"
            placeholder="event_enddate"
            {...register("event_enddate", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event_duration">Event Duration: </label>
          <input
            type="number"
            placeholder="event_duration"
            {...register("event_duration", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="team_size">Event Team Size: </label>
          <input
            type="number"
            placeholder="team_size"
            {...register("team_size", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event_formlink">Event FormLink: </label>
          <input
            type="url"
            placeholder="event_formlink"
            {...register("event_formlink", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event_price">Event Price: </label>
          <input
            type="number"
            placeholder="event_price"
            {...register("event_price", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="organizer_name">Event Organizer Name: </label>
          <input
            type="text"
            placeholder="organizer_name"
            {...register("organizer_name", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="organizer_contact">Event Organizer Contact: </label>
          <input
            type="tel"
            placeholder="organizer_contact"
            {...register("organizer_contact", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="event_category">Event Category: </label>
          <select
            {...register("event_category", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          >
            <option value="technical">technical</option>
            <option value="sports">sports</option>
            <option value="cultural">cultural</option>
            <option value="meetup">meetup</option>
            <option value="conference">conference</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="event_image">Event Images: </label>
          <input
            id="event_image"
            type="file"
            accept="image/jpeg, image/png"
            multiple={true}
            ref={imageInputRef}
            onChange={(e) => handleImageChange(e)}
            disabled={isPending}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-wrap justify-start items-center gap-4">
          {imageUrls.length > 0 ? (
            <>
              {imageUrls.map((url, index) => (
                <Image
                  width={100}
                  height={100}
                  key={url}
                  src={url}
                  alt={`img-${index}`}
                  className="border border-white rounded-lg"
                />
              ))}
            </>
          ) : (
            <h1>Image Preview Here...</h1>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event_tags">Event Tags: </label>
          <input
            type="text"
            placeholder="event_tags"
            {...register("event_tags", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event_social_links">Event Social Link: </label>
          <input
            type="text"
            placeholder="event_social_links"
            {...register("event_social_links", { required: true })}
            className="w-full border border-white p-2 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full border border-white p-2 rounded-md hover:bg-white hover:text-black"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
