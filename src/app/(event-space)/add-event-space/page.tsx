"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../../utils/supabase";
import { useRef, ChangeEvent, useState, useTransition, useEffect } from "react";
import { convertBlobUrlToFile } from "../../../action/convertBlobUrlToFile";
import { uploadImage } from "../../../action/uploadSupabase";
import { userDetails } from "../../../action/userDetails";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { userAuth } from "@/action/auth";

export default function AddEvent() {
  const [isUser, setIsUser] = useState(false);
  const [user, setUser]: any = useState(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(true);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

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

  useEffect(() => {
    userAuth().then((res) => {
      if (!res) {
        router.replace("/unauthorized");
      } else {
        setIsUser(res);
        setLoading(false);
      }
    });
  }, [router]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      if (file) {
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSizeInBytes) {
          setIsError("File size should be less than 2MB.");
          e.target.value = "";
          return;
        }

        const newImageUrls = [URL.createObjectURL(file)];

        setImageUrls(newImageUrls);
      }
    }
  };

  const onSubmit = async (event_space: any) => {
    // console.log(event_details);
    const { data, error } = await supabase
      .from("event_space")
      .insert([
        {
          name: event_space.name,
          description: event_space.description,
          location: event_space.location,
          capacity: event_space.capacity,
          price_per_hour: event_space.price_per_hour,
          owner_email: user?.email,
          owner_contact: event_space.owner_contact,
          amenities: event_space.amenities.split(","),
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
          bucket: "event_space",
        });

        if (error) {
          console.error(error);
          return;
        }

        urls.push(imageUrl);
        // console.log(imageUrl);
      }
      const { data: imageData, error: imageError }: any = await supabase
        .from("event_space_img-vid")
        .insert([
          {
            event_space_id: data[0].id,
            url: urls,
          },
        ])
        .select();
      setImageUrls([]);
      router.push(`/explore-event-space`);
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="  w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col flex-wrap gap-10 md:w-2/3"
        >
          <h1 className="text-2xl md:text-4xl font-extrabold text-center">
            Add Your Event Space
          </h1>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="event_title">Event Space Name: </label>
            <input
              type="text"
              placeholder="Enter Space Name"
              {...register("name", {
                required: true,
                max: 999,
                min: 39,
              })}
              className="w-full border border-white p-2 rounded-md bg-black text-white"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="description">Event Space Description: </label>
            <textarea
              placeholder="Enter Space Description"
              rows={4}
              cols={50}
              {...register("description", {
                required: true,
                max: 999,
                min: 39,
              })}
              className="w-full border border-white p-2 rounded-md bg-black text-white"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="location">Event Space Location: </label>
            <input
              type="text"
              placeholder="Enter Space Location"
              {...register("location", {
                required: true,
                max: 999,
                min: 38,
              })}
              className="w-full border border-white p-2 rounded-md bg-black text-white"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="capacity">Event Space Capacity: </label>
            <input
              type="number"
              placeholder="Enter Space Capacity"
              {...register("capacity", { required: true })}
              className="w-full border border-white p-2 rounded-md bg-black text-white"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="price_per_hour">
              Event Space Price (Per Hour):{" "}
            </label>
            <input
              type="number"
              placeholder="Enter Space Price (INR)"
              {...register("price_per_hour", { required: true })}
              className="w-full border border-white p-2 rounded-md bg-black text-white"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="owner_contact">Event Space Owner Contact: </label>
            <input
              type="tel"
              placeholder="Enter Owner Contact"
              {...register("owner_contact", { required: true })}
              className="w-full border border-white p-2 rounded-md bg-black text-white"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="amenities">Event Amenities: </label>
            <input
              type="text"
              placeholder="Enter Amenities (Comma Separated)"
              {...register("amenities", { required: true })}
              className="w-full border border-white p-2 rounded-md bg-black text-white"
            />
            <p>Enter Amenities Comma Seprated</p>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="event_image">Event Space Image: </label>
            <input
              id="event_space_img"
              type="file"
              accept="image/jpeg, image/png"
              ref={imageInputRef}
              onChange={(e) => handleImageChange(e)}
              disabled={isPending}
              className="w-full border border-white p-2 rounded-md bg-black text-white"
            />
            <p className="text-red-500">{isError}</p>
          </div>

          <div className="w-full flex flex-wrap justify-start items-center gap-4">
            {imageUrls.length > 0 ? (
              <>
                {imageUrls.map((url, index) => (
                  <Image
                    width={100}
                    height={100}
                    key={url}
                    src={url}
                    alt={`img-${index}`}
                    className="w-auto h-auto border border-white rounded-lg object-contain"
                  />
                ))}
              </>
            ) : (
              <h1>Image Preview Here...</h1>
            )}
          </div>

          <button
            type="submit"
            className="w-full border border-white p-2 rounded-md bg-black text-white hover:bg-white hover:text-black"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}
