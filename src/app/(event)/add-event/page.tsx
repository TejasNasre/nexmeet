"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "../../../lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Calendar } from "../../../components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { CalendarIcon } from "lucide-react";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { supabase } from "../../../utils/supabase";

const FormSchema = z.object({
  event_title: z
    .string()
    .min(10, {
      message: "Event title must be at least 10 characters.",
    })
    .max(150, {
      message: "Event title must not be longer than 160 characters.",
    }),
  event_description: z
    .string()
    .min(50, {
      message: "Event description must be at least 50 characters.",
    })
    .max(200, {
      message: "Event description must not be longer than 200 characters.",
    }),
  event_image: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, "Max file size is 2MB")
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file.type),
      "Only JPEG and PNG files are allowed"
    ),
  event_location: z
    .string()
    .min(5, {
      message: "Event location must be at least 5 characters.",
    })
    .max(100, {
      message: "Event location must not be longer than 100 characters.",
    }),
  event_startdate: z.date({
    required_error: "Please select a registration startdate",
  }),
  event_enddate: z.date({
    required_error: "Please select a registration enddate",
  }),
  event_startenddate: z.date({
    required_error: "Please select a start and end date",
  }),
  team_size: z
    .number()
    .int()
    .min(1, "Team size must be at least 1")
    .max(20, "Team size must not be more than 20"),
  event_formlink: z
    .string()
    .url()
    .max(299, "Event form link must not be longer than 300 characters."),
  event_price: z
    .number()
    .max(10, "Event price must not be longer than 10 characters."),
});

export default function AddEvent() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(event_details: z.infer<typeof FormSchema>) {
    console.log(event_details);
    console.log("addevetn");
    const { data, error } = await supabase
      .from("event_details")
      .insert([
        {
          event_title: event_details.event_title,
          event_description: event_details.event_description,
          event_image: event_details.event_image,
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
  }

  // useEffect(() => {
  //   async function readData() {
  //     let { data: event_details, error } = await supabase
  //       .from("event_details")
  //       .select("*");
  //     console.log(event_details);
  //   }

  //   readData();
  // }, []);

  return (
    <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem]  flex flex-wrap flex-col justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="event_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a title for the event"
                    className="resize-none text-white bg-black border-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="event_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a description for the event"
                    className="resize-none text-white bg-black border-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="event_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Poster</FormLabel>
                <FormControl>
                  <Input
                    id="event_image"
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                    className="text-white bg-black border-white"
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  />
                </FormControl>
                <FormDescription>
                  Leave empty if the event is free
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="outline">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
