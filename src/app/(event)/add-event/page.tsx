"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { convertBlobUrlToFile } from "../../../action/convertBlobUrlToFile";
import { uploadImage } from "../../../action/uploadSupabase";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "../../../lib/utils";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../../../components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { eventDetailsSchema } from "../../../schemas/eventDetailsSchema";
import Image from "next/image";
import { DatePickerWithRange } from "../../../components/DatePickerWithRange";
import { supabase } from "../../../utils/supabase";
import { useRef, ChangeEvent, useState, useTransition } from "react";

export default function SignInForm() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof eventDetailsSchema>>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: {
      event_title: "",
      event_description: "",
      event_images: [],
      event_startdate: new Date(),
      event_enddate: new Date(),
      event_startenddate: new Date(),
      team_size: 1,
      event_formlink: "",
      event_location: "",
      event_price: 0,
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      setImageUrls([...imageUrls, ...newImageUrls]);
    }
  };

  const onSubmit = async (
    event_details: z.infer<typeof eventDetailsSchema>
  ) => {
    // console.log(event_details);
    const { data, error } = await supabase
      .from("event_details")
      .insert([
        {
          event_title: event_details.event_title,
          event_description: event_details.event_description,
          event_image: event_details.event_images,
          event_location: event_details.event_location,
          event_startdate: event_details.event_startdate,
          event_startenddate: event_details.event_startenddate,
          event_enddate: event_details.event_enddate,
          team_size: event_details.team_size,
          event_formlink: event_details.event_formlink,
          event_price: event_details.event_price,
        },
      ])
      .select();

    if (error) {
      console.error(error);
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
      }
      setImageUrls([]);
    });
  };

  return (
    <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem]  flex flex-wrap flex-col justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:w-2/3 px-4 space-y-6"
        >
          <FormField
            name="event_title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <Input type="text" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="event_description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Description</FormLabel>
                <Input type="text" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="event_images"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Poster</FormLabel>
                <Input
                  id="event_image"
                  type="file"
                  accept="image/jpeg, image/png"
                  multiple={true}
                  ref={imageInputRef}
                  onChange={(e) => handleImageChange(e)}
                  disabled={isPending}
                  className="text-white bg-black border-white"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap justify-start items-center gap-4">
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
          </div>
          <FormField
            control={form.control}
            name="event_startdate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Registration Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a start date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="event_enddate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Registration End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a end date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="event_startenddate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Start Date To End Date</FormLabel>
                <DatePickerWithRange />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="team_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Size</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Team Size"
                    type="number"
                    className="text-white bg-black border-white"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="event_formlink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Form Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Google Form / Website Link"
                    type="text"
                    className="text-white bg-black border-white"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="event_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter event location"
                    type="text"
                    className="text-white bg-black border-white"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="event_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Event Price"
                    type="number"
                    className="text-white bg-black border-white"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Leave empty if the event is free
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-slate-600 py-2 w-full rounded-lg"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
