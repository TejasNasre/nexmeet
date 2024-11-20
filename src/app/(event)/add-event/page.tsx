"use client";
import React, { useState, useCallback, useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { userDetails } from "../../../action/userDetails";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/components/loading";
import LocationAutocomplete from "@/components/form-fields/LocationAutocomplete";

import { supabase } from "../../../utils/supabase";
import { uploadImage } from "../../../action/uploadSupabase";
import { KindeUserBase } from "@kinde-oss/kinde-auth-nextjs/types";
import { Loader2 } from "lucide-react";
import { convertBlobUrlToFile } from "@/action/convertBlobUrlToFile";
import { format, isBefore } from "date-fns";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z
  .object({
    event_title: z
      .string()
      .min(2, { message: "Event title must be at least 2 characters." }),
    event_description: z.string().min(10, {
      message: "Event description must be at least 10 characters.",
    }),
    event_location: z
      .string()
      .min(2, { message: "Event location must be at least 2 characters." }),
    event_registration_startdate: z
      .string()
      .min(1, { message: "Registration start date is required." }),
    event_registration_enddate: z
      .string()
      .min(1, { message: "Registration end date is required." }),
    event_startdate: z
      .string()
      .min(1, { message: "Event start date is required." }),
    event_enddate: z
      .string()
      .min(1, { message: "Event end date is required." }),
    event_duration: z
      .string()
      .min(1, { message: "Duration is required." })
      .regex(/^[1-9]\d*$/, { message: "Duration must be a positive number." })
      .refine((value) => Number(value) > 0, {
        message: "Duration must be a positive number.",
      }),
    team_size: z
      .string()
      .min(1, { message: "Team size is required." })
      .regex(/^[1-9]\d*$/, { message: "Team size must be a positive number." }),
    isEventFree: z.enum(["0", "paid"]),
    account_holder_name: z.string().optional(),
    upi_id: z.string().optional(),
    event_amount: z.string().optional(),
    organizer_name: z
      .string()
      .min(2, { message: "Organizer name must be at least 2 characters." }),
    organizer_contact: z
      .string()
      .min(10, { message: "Contact number must be at least 10 digits." })
      .max(15, { message: "Contact number must not exceed 15 digits." })
      .regex(/^\+?[0-9]+$/, {
        message: "Please enter a valid contact number.",
      }),
    event_category: z.string().min(1, { message: "Please select a category." }),
    event_tags: z.string().min(1, { message: "At least one tag is required." }),
    event_social_links: z
      .string()
      .min(1, { message: "At least one social link is required." }),
    event_poster: z
      .custom<FileList>()
      .refine((files) => files?.length === 1, "Poster is required.")
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        `Max file size is 2MB.`
      )
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),
  })
  .refine(
    (data) => {
      const regStart = new Date(data.event_registration_startdate);
      const regEnd = new Date(data.event_registration_enddate);
      const eventStart = new Date(data.event_startdate);
      const eventEnd = new Date(data.event_enddate);
      const now = new Date();

      // Check if any of the dates are invalid
      if (
        isNaN(regStart.getTime()) ||
        isNaN(regEnd.getTime()) ||
        isNaN(eventStart.getTime()) ||
        isNaN(eventEnd.getTime())
      ) {
        console.error("One or more dates are invalid");
        return false;
      }

      if (isBefore(regStart, now)) {
        return {
          message: "Registration start date must be in the future.",
          path: ["event_registration_startdate"],
        };
      }
      if (isBefore(regEnd, regStart)) {
        return {
          message:
            "Registration end date must be after registration start date.",
          path: ["event_registration_enddate"],
        };
      }
      if (isBefore(eventStart, regEnd)) {
        return {
          message: "Event start date must be after registration end date.",
          path: ["event_startdate"],
        };
      }
      if (isBefore(eventEnd, eventStart)) {
        return {
          message: "Event end date must be after event start date.",
          path: ["event_enddate"],
        };
      }

      return true;
    },
    {
      message:
        "Invalid date range. Please check all dates and ensure they are in the correct order.",
    }
  )
  .refine(
    (data) => {
      const links = data.event_social_links
        .split(",")
        .map((link) => link.trim())
        .filter((link) => link !== "");

      if (links.length === 0) {
        return false;
      }

      const urlSchema = z.string().url();
      const results = links.map((link) => urlSchema.safeParse(link));
      const invalidLinks = results.filter((result) => !result.success);

      return invalidLinks.length === 0;
    },
    {
      message:
        "One or more social links are invalid. Please ensure all links are valid URLs.",
      path: ["event_social_links"],
    }
  );

export default function AddEvent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const [user, setUser] = useState<KindeUserBase | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [fee, setFee] = useState("free");

  const today = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  const cleanAndSplitString = (str: string) =>
    str
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_title: "",
      event_description: "",
      event_location: "",
      event_registration_startdate: "",
      event_registration_enddate: "",
      event_startdate: "",
      event_enddate: "",
      event_duration: "",
      team_size: "",
      isEventFree: "0",
      account_holder_name: "",
      upi_id: "",
      event_amount: "",
      organizer_name: "",
      organizer_contact: "",
      event_category: "",
      event_tags: "",
      event_social_links: "",
      event_poster: undefined,
    },
  });

  useEffect(() => {
    userDetails()
      .then((res: KindeUserBase) => setUser(res))
      .catch((error: Error) => {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details");
        setUser(null);
      });
  }, []);

  const onPosterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFile(files[0]);
        const newImageUrl = URL.createObjectURL(files[0]);
        setImageUrls([newImageUrl]);
        form.setValue("event_poster", files, { shouldValidate: true });
      }
    },
    [form]
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to submit an event.");
      return;
    }

    startTransition(async () => {
      try {
        // Check for date validation here
        if (
          values.event_registration_startdate >
          values.event_registration_enddate
        ) {
          toast.error("Registration start date must be before end date.");
          form.setError("event_registration_startdate", {
            type: "manual",
            message: "Registration start date must be before end date.",
          });
          return;
        }

        if (values.event_startdate > values.event_enddate) {
          toast.error("Event start date must be before end date.");
          form.setError("event_startdate", {
            type: "manual",
            message: "Event start date must be before end date.",
          });
          return;
        }

        if (values.event_enddate < values.event_registration_enddate) {
          toast.error("Event must start after registration ends.");
          form.setError("event_enddate", {
            type: "manual",
            message: "Event must start after registration ends.",
          });
          return;
        }

        const eventDetails = {
          event_title: values.event_title,
          event_description: values.event_description,
          event_location: values.event_location,
          event_registration_startdate: values.event_registration_startdate,
          event_registration_enddate: values.event_registration_enddate,
          event_startdate: values.event_startdate,
          event_enddate: values.event_enddate,
          event_duration: parseInt(values.event_duration, 10),
          team_size: parseInt(values.team_size, 10),
          isEventFree: values.isEventFree,
          account_holder_name:
            values.isEventFree === "0" ? undefined : values.account_holder_name,
          upi_id: values.isEventFree === "0" ? undefined : values.upi_id,
          event_amount:
            values.isEventFree === "0"
              ? undefined
              : parseInt(values.event_amount || "0", 10),
          organizer_name: values.organizer_name,
          organizer_email: user?.email,
          organizer_contact: values.organizer_contact,
          event_category: values.event_category,
          event_tags: cleanAndSplitString(values.event_tags),
          event_social_links: cleanAndSplitString(values.event_social_links),
        };

        const { data, error } = await supabase
          .from("event_details")
          .insert([eventDetails])
          .select();

        if (error) throw error;
        if (!data || data.length === 0)
          throw new Error("No data returned from the insert operation.");

        const eventId = data[0].id;

        if (file) {
          const imageFile = await convertBlobUrlToFile(imageUrls[0]);
          const { imageUrl, error: uploadError } = await uploadImage({
            file: imageFile,
            bucket: "event_image",
          });

          if (uploadError) throw uploadError;

          const { error: imageError } = await supabase
            .from("event_images")
            .insert([{ event_id: eventId, url: [imageUrl] }])
            .select();

          if (imageError) throw imageError;
        }

        // Send notification email after successful registration
        try {
          await fetch("/api/email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "submission",
              eventDetails: {
                ...eventDetails,
                event_startdate: eventDetails.event_startdate.toString(),
                event_enddate: eventDetails.event_enddate.toString(),
              },
            }),
          });
          toast.success("Notification email sent successfully!");
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          toast.error("Failed to send email notification");
        }

        toast.success("Event created successfully!");
        router.push(`/explore-events/${eventId}`);
      } catch (error) {
        console.error("Error during form submission:", error);
        toast.error("Failed to create event.", {
          description:
            error instanceof Error
              ? error.message
              : "An error occurred while creating the event. Please try again.",
        });
      }
    });
  };

  if (isLoading) return <Loading />;

  if (!isAuthenticated) {
    router.push("/unauthorized");
    return null;
  }

  return (
    <div className="bg-black text-white pt-[6.5rem] pb-16">
      <div className="container mx-auto p-6 space-y-8 w-full md:w-2/3">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-10">
          Organise Event
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <FormField
              control={form.control}
              name="event_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Event Title:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Event Title"
                      {...field}
                      className="bg-black border-white text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Event Description:
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Event Description"
                      {...field}
                      className="bg-black border-white text-white min-h-28"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Event Location:</FormLabel>
                  <FormControl>
                    {/* <LocationAutocomplete
                      onSelect={(value) => {
                        field.onChange(value);
                        form.setValue("event_location", value, { shouldValidate: true });
                      }}
                      placeholder="Enter Event Location"
                    /> */}
                    <Input
                      placeholder="Enter Event Location"
                      {...field}
                      className="bg-black border-white text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_registration_startdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Registration Start Date:
                  </FormLabel>
                  <FormControl>
                    <input
                      type="datetime-local"
                      {...field}
                      min={today}
                      className="w-full p-2 text-white bg-black border border-white rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_registration_enddate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Event Registration End Date:
                  </FormLabel>
                  <FormControl>
                    <input
                      type="datetime-local"
                      {...field}
                      min={today}
                      className="w-full p-2 text-white bg-black border border-white rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_startdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Event Start Date:</FormLabel>
                  <FormControl>
                    <input
                      type="datetime-local"
                      {...field}
                      min={today}
                      className="w-full p-2 text-white bg-black border border-white rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_enddate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Event End Date:</FormLabel>
                  <FormControl>
                    <input
                      type="datetime-local"
                      {...field}
                      min={today}
                      className="w-full p-2 text-white bg-black border border-white rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Event Duration:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Event Duration (In hours)"
                      {...field}
                      className="bg-black border-white text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Team Size:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Team Size"
                      {...field}
                      className="bg-black border-white text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="flex flex-col justify-start gap-4">
              <FormField
                control={form.control}
                name="isEventFree"
                render={({ field }) => (
                  <FormItem className="flex justify-start items-center gap-4">
                    <FormLabel className="text-base">
                      Event Cost Type :
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="bg-black border-2 border-white text-white py-1 px-2 rounded-md"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                          setFee(value === "0" ? "free" : "paid");
                        }}
                      >
                        <option value="0">Free</option>
                        <option value="paid">Paid</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              {fee === "free" ? (
                <>Your Event Is Free</>
              ) : (
                <>Your Event Is Paid</>
              )}
              {fee === "free" ? (
                ""
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="account_holder_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Account Holder Name:
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter account holder name"
                              {...field}
                              className="bg-black border-white text-white"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="upi_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Upi Id:</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Upi Id"
                              {...field}
                              className="bg-black border-white text-white"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="event_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Event Price (Amount):
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter Upi Id"
                              {...field}
                              className="bg-black border-white text-white"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </div>

            <FormField
              control={form.control}
              name="organizer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Event Organizer / Organization Name:
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organizer name"
                      {...field}
                      className="bg-black border-white text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizer_contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Event Organizer / Organization Contact:
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter contact number"
                      {...field}
                      className="bg-black border-white text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Event Category:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-black border-white text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-white text-white">
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="meetup">Meetup</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_poster"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel className="text-base">Event Poster:</FormLabel>
                  <FormControl>
                    <input
                      id="event_poster"
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={(e) => {
                        onPosterChange(e);
                        onChange(e.target.files);
                      }}
                      className="w-full p-2 text-white bg-black border border-white rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                  {imageUrls.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Preview:</p>
                      <Image
                        src={imageUrls[0]}
                        alt="Poster preview"
                        width={200}
                        height={200}
                        className="object-contain"
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Event Tags:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Event Tags (Comma Separated)"
                      {...field}
                      className="bg-black border-white text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_social_links"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Event Social Links:
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Social Links (Comma Separated)"
                      {...field}
                      className="bg-black border-white text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
