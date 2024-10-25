"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { userDetails } from "@/action/userDetails";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface User {
  id: string;
  email: string;
}

interface Event {
  id: string;
  event_title: string;
  event_description: string;
  organizer_email: string;
}

export default function EditEvent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    userDetails()
      .then((res: any) => {
        setUser(res);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setUser(null);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const organizeEvents: any = async () => {
      let { data: organised_events, error } = await supabase
        .from("event_details")
        .select("*")
        .eq("organizer_email", user?.email);

      if (error) {
        console.log(error);
      }
      setLoading(true);
      setEvents(organised_events || []);
      setLoading(false);
    };

    organizeEvents();
  }, [user]);

  const data = events.map((event: any) => ({
    name: event.event_title,
    value: 1,
    category: event.event_category,
  }));

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean;
    payload: any[];
    label: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-black text-white p-2 rounded shadow-lg">
          <p className="label">{`${payload[0].name}`}</p>
          <p className="intro">{`Category: ${payload[0].payload.category}`}</p>
        </div>
      );
    }
    return null;
  };

  const handleDeleteEvent = async () => {
    if (!deleteEventId) return;

    const { error: deleteParticipantsError } = await supabase
      .from("event_participants")
      .delete()
      .eq("event_id", deleteEventId);

    if (deleteParticipantsError) {
      console.error(
        "Error deleting related participants:",
        deleteParticipantsError
      );
      return;
    }

    const { error: deleteImagesError } = await supabase
      .from("event_images")
      .delete()
      .eq("event_id", deleteEventId);

    if (deleteImagesError) {
      console.error("Error deleting related images:", deleteImagesError);
      return;
    }

    const { error: deleteEventError } = await supabase
      .from("event_details")
      .delete()
      .eq("id", deleteEventId);

    if (deleteEventError) {
      console.error("Error deleting event:", deleteEventError);
    } else {
      setSuccessMessage("Event deleted successfully.");
    }

    setDeleteEventId(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full h-auto bg-black text-white py-[8rem] px-4 flex flex-col">
          <div className="flex flex-col justify-center items-center gap-4">
            <h1 className="text-3xl font-bold text-center my-10">
                Administer Events
            </h1>
            {successMessage && (
              <div className="mb-4 p-4 bg-green-500 text-white rounded">
                {successMessage}
              </div>
            )}
            <div className="w-full flex flex-wrap gap-6 justify-center">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="bg-black w-full flex flex-col h-[auto]"
                >
                  <CardHeader>
                    <CardTitle>{event.event_title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <p className="flex-grow mb-4">{event.event_description}</p>
                    <div className="flex space-x-4">
                      <Button variant="outline"
                      className="w-32 bg-transparent hover:bg-green-500">
                        <Link href={`/update-event?eventId=${event.id}?status=approve`}>
                          Approve
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-32 bg-transparent hover:bg-red-500">
                        <Link href={`/update-event?eventId=${event.id}?status=reject`}>
                          Reject
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    router.push("/unauthorized")
  );
}
