"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  communityName: z.string().min(1, "Community name is required"),
  logo: z.instanceof(File).optional(),
  tagline: z.string().min(1, "Tagline is required"),
  category: z.string().min(1, "Category is required"),
  contactInfo: z.string().min(1, "Contact information is required"),
  location: z.string().min(1, "Location is required"),
  website: z.string().url("Invalid URL").optional(),
  about: z.string().min(1, "About section is required"),
  mission: z.string().min(1, "Mission statement is required"),
  benefits: z.string().min(1, "Benefits are required"),
  events: z.string().min(1, "Event types are required"),
  media: z.instanceof(File).optional(),
  communitySize: z.number().min(1, "Community size must be at least 1"),
});

type FormData = z.infer<typeof formSchema>;

export default function AddCommunityForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      communityName: "",
      tagline: "",
      category: "",
      contactInfo: "",
      location: "",
      website: "",
      about: "",
      mission: "",
      benefits: "",
      events: "",
      communitySize: 1,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      // Upload logo to Supabase storage
      let logoUrl = "";
      if (data.logo) {
        const logoFileName = `${uuidv4()}-${data.logo.name}`;
        const { data: logoData, error: logoError } = await supabase.storage
          .from("community-logos")
          .upload(logoFileName, data.logo);

        if (logoError) {
          throw new Error("Failed to upload logo");
        }
        logoUrl = logoData.path;
        toast.success("Logo uploaded successfully!");
      }

      // Upload media to Supabase storage
      let mediaUrl = "";
      if (data.media) {
        const mediaFileName = `${uuidv4()}-${data.media.name}`;
        const { data: mediaData, error: mediaError } = await supabase.storage
          .from("community-media")
          .upload(mediaFileName, data.media);

        if (mediaError) {
          throw new Error("Failed to upload media");
        }
        mediaUrl = mediaData.path;
        toast.success("Media uploaded successfully!");
      }

      // Insert data into Supabase
      const { error } = await supabase.from("communities").insert([
        {
          community_name: data.communityName,
          logo_url: logoUrl,
          tagline: data.tagline,
          category: data.category,
          contact_info: data.contactInfo,
          location: data.location,
          website: data.website,
          about: data.about,
          mission: data.mission,
          benefits: data.benefits,
          events: data.events,
          media_url: mediaUrl,
          community_size: data.communitySize,
        },
      ]);

      if (error) {
        throw new Error("Failed to add community");
      }

      // Send email notification
      await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "community-added",
          communityDetails: {
            communityName: data.communityName,
            contactInfo: data.contactInfo,
          },
        }),
      });

      toast.success("Community added successfully!");
      reset();
      router.push("/explore-community");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white py-[8rem] px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-extrabold text-center mb-8">
          Add Your Community
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="my-4">
            <Label htmlFor="communityName">Community/Club Name</Label>
            <Controller
              name="communityName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="communityName"
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              )}
            />
            {errors.communityName && (
              <p className="text-red-500 mt-1">
                {errors.communityName.message}
              </p>
            )}
          </div>

          <div className="my-4">
            <Label htmlFor="logo">Logo or Profile Image</Label>
            <Controller
              name="logo"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  {...field}
                  id="logo"
                  type="file"
                  onChange={(e) => onChange(e.target.files?.[0])}
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              )}
            />
          </div>

          <div className="my-4">
            <Label htmlFor="tagline">Tagline</Label>
            <Controller
              name="tagline"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="tagline"
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              )}
            />
            {errors.tagline && (
              <p className="text-red-500 mt-1">{errors.tagline.message}</p>
            )}
          </div>

          <div className="my-4">
            <Label htmlFor="category">Category/Type of Community</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div className="w-full p-2 text-white bg-black border border-white rounded-md">
                  <select
                    {...field}
                    className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
                  >
                    <option value="" className="bg-black text-white">
                      Select a category
                    </option>
                    <option value="technology" className="bg-black text-white">
                      Technology
                    </option>
                    <option value="sports" className="bg-black text-white">
                      Sports
                    </option>
                    <option value="arts" className="bg-black text-white">
                      Arts
                    </option>
                    <option value="education" className="bg-black text-white">
                      Education
                    </option>
                    <option value="social" className="bg-black text-white">
                      Social
                    </option>
                    <option
                      value="professional"
                      className="bg-black text-white"
                    >
                      Professional
                    </option>
                    <option value="hobby" className="bg-black text-white">
                      Hobby
                    </option>
                    <option value="other" className="bg-black text-white">
                      Other
                    </option>
                  </select>
                </div>
              )}
            />
            {errors.category && (
              <p className="text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div className="my-4">
            <Label htmlFor="contactInfo">
              Community Email (If Not Enter Founder Email)
            </Label>
            <Controller
              name="contactInfo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="contactInfo"
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              )}
            />
            {errors.contactInfo && (
              <p className="text-red-500 mt-1">{errors.contactInfo.message}</p>
            )}
          </div>

          <div className="my-4">
            <Label htmlFor="location">Physical Location or City</Label>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="location"
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              )}
            />
            {errors.location && (
              <p className="text-red-500 mt-1">{errors.location.message}</p>
            )}
          </div>

          <div className="my-4">
            <Label htmlFor="website">Website or Social Media Links</Label>
            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="website"
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              )}
            />
            {errors.website && (
              <p className="text-red-500 mt-1">{errors.website.message}</p>
            )}
          </div>

          <div className="my-4">
            <Label htmlFor="about">About the Community</Label>
            <Controller
              name="about"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="about"
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              )}
            />
            {errors.about && (
              <p className="text-red-500 mt-1">{errors.about.message}</p>
            )}
          </div>

          <div className="my-4">
            <Label htmlFor="mission">Mission and Values</Label>
            <Controller
              name="mission"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="mission"
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              )}
            />
            {errors.mission && (
              <p className="text-red-500 mt-1">{errors.mission.message}</p>
            )}
          </div>

          <div className="my-4">
            <Label htmlFor="benefits">Benefits for Members</Label>
            <Controller
              name="benefits"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="benefits"
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              )}
            />
            {errors.benefits && (
              <p className="text-red-500 mt-1">{errors.benefits.message}</p>
            )}
          </div>

          <div className="my-4">
            <Label htmlFor="events">Types of Events Organized</Label>
            <Controller
              name="events"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="events"
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              )}
            />
            {errors.events && (
              <p className="text-red-500 mt-1">{errors.events.message}</p>
            )}
          </div>

          <div className="my-4">
            <Label htmlFor="media">Photos or Videos</Label>
            <Controller
              name="media"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  {...field}
                  id="media"
                  type="file"
                  onChange={(e) => onChange(e.target.files?.[0])}
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              )}
            />
          </div>

          <div className="my-4">
            <Label htmlFor="communitySize">Community Size</Label>
            <Controller
              name="communitySize"
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <Input
                  {...rest}
                  id="communitySize"
                  type="number"
                  onChange={(e) => onChange(parseInt(e.target.value, 10))}
                  className="w-full p-2 text-white bg-black border border-white rounded-md"
                />
              )}
            />
            {errors.communitySize && (
              <p className="text-red-500 mt-1">
                {errors.communitySize.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Add Community"}
          </Button>
        </form>
      </div>
    </div>
  );
}
