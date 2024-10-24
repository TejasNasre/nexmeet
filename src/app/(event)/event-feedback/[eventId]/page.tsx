"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const feedbackSchema = z.object({
  enjoyMost: z
    .string()
    .min(1, "Please describe what you enjoyed.")
    .max(120, "Enjoyment description should be less than 120 characters."),

  organization_rating: z.enum(["Excellent", "Good", "Average", "Poor"]),

  overall_satisfaction: z
    .string()
    .min(1, "Satisfaction must be between 1 and 5."),

  recommendations: z.string(),

  improvement: z
    .string()
    .min(1, "Please suggest what we can improve.")
    .max(120, "Suggestions should be less than 120 characters.")
    .optional(),
});

export default function ResponseForm() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId;
  const { user, isAuthenticated } = useKindeBrowserClient();

  const [formTitle, setFormTitle] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchEventDetails() {
      if (!eventId) return;

      const { data: eventData } = await supabase
        .from("event_details")
        .select("event_title")
        .eq("id", eventId)
        .single();

      if (eventData) {
        setFormTitle(eventData.event_title);
      }
    }

    fetchEventDetails();
  }, [eventId]);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      enjoyMost: "",
      organization_rating: "Average",
      overall_satisfaction: "",
      recommendations: "",
      improvement: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof feedbackSchema>) => {
    if (!isAuthenticated || !user || !eventId) return;

    startTransition(async () => {
      try {
        const { error: feedbackError } = await supabase
          .from("event_feedback")
          .insert({
            event_id: eventId,
            enjoy_most: values.enjoyMost,
            organization_rating: values.organization_rating,
            overall_satisfaction: Number(values.overall_satisfaction),
            recommendation: Number(values.recommendations),
            improvement: values.improvement,
            respondent_email: user.email,
          });

        if (feedbackError) throw feedbackError;
        toast.success("Feedback submitted successfully!");
        router.push("/dashboard");
      } catch (error) {
        console.error("Error submitting feedback:", error);
        toast.error("There was an error submitting your feedback.");
      }
    });
  };

  return (
    <div className="w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Feedback Form for {formTitle}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full flex flex-col gap-10 md:w-2/3"
        >
          {/* What did you enjoy the most about the event? */}
          <FormField
            control={form.control}
            name="enjoyMost"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  What did you enjoy the most?
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    className="bg-black border-white text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* How would you rate your overall satisfaction? */}
          <FormField
            control={form.control}
            name="overall_satisfaction"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-2">
                  How would you rate your overall satisfaction with the event?
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2 mb-4 rating">
                    {[1, 2, 3, 4, 5].map((value: number) => (
                      <Input
                        key={value} // Add key to prevent React warnings
                        type="radio"
                        {...field} // Spread the field props
                        value={value.toString()}
                        className="mask mask-star-2 bg-orange-400 h-6 w-6" // Adjust size as needed
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* How would you rate the overall organization of the event? */}
          <FormField
            control={form.control}
            name="organization_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block mb-2">
                  How would you rate the overall organization of the event?
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {["Excellent", "Good", "Average", "Poor"].map(
                      (label, index) => (
                        <div key={label} className="flex gap-2 items-center">
                          <input
                            type="radio"
                            {...field}
                            value={label}
                            className="cursor-pointer"
                            required
                          />
                          <span>{label}</span>
                        </div>
                      )
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* How likely are you to recommend this event? */}
          <FormField
            control={form.control}
            name="recommendations"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2">
                  How likely are you to recommend this event to a friend or
                  colleague?
                </FormLabel>
                <FormControl>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    className="range range-xs w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* What could we improve? */}
          <FormField
            control={form.control}
            name="improvement"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  What could we improve?
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    className="bg-black border-white text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full border border-white p-2 rounded-md bg-black text-white hover:bg-white hover:text-black"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
