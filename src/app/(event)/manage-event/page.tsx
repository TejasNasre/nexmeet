"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { userAuth } from "@/action/auth";
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
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    userAuth().then((res) => {
      if (!res) {
        router.replace("/unauthorized");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    userDetails()
      .then((res: any) => {
        setUser(res);
        fetchEvents(res.email);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setUser(null);
        setLoading(false);
      });
  }, []);

  const fetchEvents = async (email: string) => {
    const { data, error } = await supabase
      .from("event_details")
      .select("*")
      .eq("organizer_email", email);

    if (error) {
      console.error("Error fetching events:", error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const handleDeleteEvent = async () => {
    if (!deleteEventId) return;

    // Delete related records from event_participants table
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

    // Delete related records from event_images table
    const { error: deleteImagesError } = await supabase
      .from("event_images")
      .delete()
      .eq("event_id", deleteEventId);

    if (deleteImagesError) {
      console.error("Error deleting related images:", deleteImagesError);
      return;
    }

    // Delete the event from event_details table
    const { error: deleteEventError } = await supabase
      .from("event_details")
      .delete()
      .eq("id", deleteEventId);

    if (deleteEventError) {
      console.error("Error deleting event:", deleteEventError);
    } else {
      setSuccessMessage("Event deleted successfully.");
      fetchEvents(user?.email || "");
    }

    setDeleteEventId(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem] px-4 flex flex-col">
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-3xl font-bold text-center my-10">
          Edit Your Events
        </h1>
        {successMessage && (
          <div className="mb-4 p-4 bg-green-500 text-white rounded">
            {successMessage}
          </div>
        )}
        <div className="grid gap-6">
          {loading ? (
            <Loading />
          ) : (
            <>
              {events.map((event) => (
                <Card key={event.id} className="bg-black">
                  <CardHeader>
                    <CardTitle>{event.event_title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{event.event_description}</p>
                    <div className="flex space-x-4">
                      <Button variant="outline">
                        <Link href={`/update-event?eventId=${event.id}`}>
                          Edit Event
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setDeleteEventId(event.id)}
                          >
                            Delete Event
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black text-white p-4">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your event and remove all data
                              associated with it.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteEvent()}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
