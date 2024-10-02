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
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

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

  const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

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
      {
        // console.log(organised_events);
        setLoading(true);
        setEvents(organised_events || []);
        setLoading(false);
      }
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
    }

    setDeleteEventId(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <>
      {loading ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <div className="  w-full h-auto bg-black text-white py-[8rem] px-4 flex flex-col">
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
                                    permanently delete your event and remove all
                                    data associated with it.
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
            <div className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
              <Card className="w-full border-0">
                <CardHeader>
                  <CardTitle className="text-center">
                    Organised Event Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart className="py-10 md:p-0">
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ percent }) =>
                          `(${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {data.map((entry: any, index: any) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={
                          <CustomTooltip
                            active={false}
                            payload={[]}
                            label={""}
                          />
                        }
                        cursor={{ fill: "transparent" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  ) : (
    router.push("/unauthorized")
  );
}
