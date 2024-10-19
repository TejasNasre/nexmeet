"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/form-fields/form-fields";
import { toast } from "sonner";

export default function ResponseForm() {
    const params = useParams();
    const eventId = params?.eventId; // Get the eventId from URL params
    const { user, isAuthenticated } = useKindeBrowserClient();

    const [formTitle, setFormTitle] = useState<string>("");
    const [enjoyMost, setEnjoyMost] = useState<string>("");
    const [organizationRating, setOrganizationRating] = useState<string>("");
    const [overallSatisfaction, setOverallSatisfaction] = useState<number>(0);
    const [recommendation, setRecommendation] = useState<number>(0);
    const [improvement, setImprovement] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        async function fetchEventDetails() {
            if (!eventId) return;

            // Fetch event details from the event_details table
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !user || !eventId) return;

        startTransition(async () => {
            try {
                // Insert feedback into the event_feedback table
                const { error: feedbackError } = await supabase
                    .from("event_feedback")
                    .insert({
                        event_id: eventId,
                        enjoy_most: enjoyMost,
                        organization_rating: organizationRating,
                        overall_satisfaction: overallSatisfaction,
                        recommendation: recommendation,
                        improvement: improvement,
                        respondent_email: user.email
                    });

                if (feedbackError) throw feedbackError;
                toast.success("Feedback submitted successfully!");
            } catch (error) {
                console.error("Error submitting feedback:", error);
                toast.error("There was an error submitting your feedback.");
            }
        });
    };

    return (
        <div className="w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4">Feedback Form for {formTitle}</h1>
            <form
                className="w-full flex flex-col gap-10 md:w-2/3"
                onSubmit={handleSubmit}
            >
                {/* What did you enjoy the most about the event? */}
                <div className="mb-4">
                    <label className="block mb-2">What did you enjoy the most?</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={enjoyMost}
                        onChange={(e) => setEnjoyMost(e.target.value)}
                        required
                    />
                </div>

                {/* How would you rate the overall organization? */}
                <div className="mb-4">
                    <label className="block mb-2">
                        How would you rate the overall organization of the event?
                    </label>
                    <div className="space-y-2">
                        {["Excellent", "Good", "Average", "Poor"].map((option) => (
                            <div key={option} className="flex gap-2 items-center">
                                <input
                                    type="radio"
                                    name="organization_rating"
                                    value={option}
                                    onChange={() => setOrganizationRating(option)}
                                    required
                                />
                                <span>{option}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How would you rate your overall satisfaction? */}
                <div className="mb-4">
                    <label className="block mb-2">
                        How would you rate your overall satisfaction with the event?
                    </label>
                    <div className="rating">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <input
                                key={value}
                                type="radio"
                                name="overall_satisfaction"
                                className="mask mask-star-2 bg-orange-400"
                                value={value}
                                onChange={() => setOverallSatisfaction(value)}
                                required
                            />
                        ))}
                    </div>
                </div>

                {/* How likely are you to recommend this event? */}
                <SliderField
                    label="How likely are you to recommend this event to a friend or colleague?"
                    min={1}
                    max={10}
                    onChange={(value) => setRecommendation(value as number)}
                />

                {/* What could we improve? */}
                <div className="mb-4">
                    <label className="block mb-2">What could we improve?</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={improvement}
                        onChange={(e) => setImprovement(e.target.value)}
                        required
                    />
                </div>

                {/* Submit button */}
                <Button
                    type="submit"
                    className="w-full border border-white p-2 rounded-md bg-black text-white hover:bg-white hover:text-black"
                    disabled={isPending}
                >
                    {isPending ? "Submitting..." : "Submit Feedback"}
                </Button>
            </form>
        </div>
    );
}