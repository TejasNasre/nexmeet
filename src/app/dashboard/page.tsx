"use client";

import React, { useEffect, useMemo, useState } from "react";
import { userDetails } from "../../action/userDetails";
import Loading from "../../components/loading";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  MapPin,
  Users,
  Star,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mergeConfigs } from "tailwind-merge";

interface User {
  id: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
}

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("organized");

  const [organisedEvent, setOrganisedEvent] = useState<any[] | null>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userDetails()
      .then((res: any) => {
        // console.log(res)
        setUser(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setUser(null);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const organizeEvents: any = async () => {
      let { data: event_details, error } = await supabase
        .from("event_details")
        .select("*")
        .eq("organizer_email", user?.email);

      if (error) {
        console.log(error);
      }
      {
        setLoading(true);
        setOrganisedEvent(event_details);
        setLoading(false);
        // console.log(event_details);
      }
    };
    organizeEvents();
  }, [user]);

  const memoizedEvents = useMemo(() => organisedEvent, [organisedEvent]);

  return (
    <>
      <div className="absolute top-0 w-full h-auto bg-black text-white py-[8rem] flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col justify-start items-center gap-24 md:border md:border-white rounded-md p-10">
            <h1 className="text-center text-4xl font-bold">Your Profile</h1>
            {loading ? (
              <Loading />
            ) : user ? (
              <div className="flex flex-col justify-center items-center gap-4">
                <Image
                  src={user.picture}
                  alt={`${user.given_name} ${user.family_name}`}
                  width={96}
                  height={96}
                  className="rounded-full border-2 border-white"
                />
                <h1>
                  {user.given_name} {user.family_name}
                </h1>
                <h2>{user.email}</h2>
                <LogoutLink className="mono transition ease-in-out delay-100 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md px-4 py-1">
                  Log out
                </LogoutLink>
              </div>
            ) : (
              <h1>No user details available</h1>
            )}
          </div>
          <div className="flex-grow space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-black text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Events
                  </CardTitle>
                  <CalendarDays size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {memoizedEvents?.length ? memoizedEvents.length : 0}
                  </div>
                  {/* <p className="text-xs text-purple-200">+2 this month</p> */}
                </CardContent>
              </Card>
              <Card className="bg-black text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Attendees
                  </CardTitle>
                  <Users size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  {/* <p className="text-xs text-pink-200">+99 this week</p> */}
                </CardContent>
              </Card>
              <Card className="bg-black text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg. Rating
                  </CardTitle>
                  <Star size={20} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  {/* <p className="text-xs text-yellow-200">
                    +0.2 from last month
                  </p> */}
                </CardContent>
              </Card>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-4">
              <Button variant="outline" className="w-full">
                <Link href="/add-events">Organised Your Own Event</Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Link href="/events">View All Events</Link>
              </Button>
            </div>

            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-muted">
                <div className="flex flex-col gap-8 md:flex-row justify-between items-center">
                  <CardTitle>Your Events</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant={
                        activeTab === "organized" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveTab("organized")}
                    >
                      Organized
                    </Button>
                    <Button
                      variant={
                        activeTab === "participated" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveTab("participated")}
                    >
                      Participated
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className={`${loading ? `h-auto` : `p-0`}`}>
                <div className="divide-y">
                  {/* {[1, 2, 3].map((event) => (
                    <div
                      key={event}
                      className="p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {activeTab === "organized"
                              ? `Tech Conference ${event}`
                              : `Workshop ${event}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <Badge
                          variant={
                            activeTab === "organized" ? "default" : "secondary"
                          }
                        >
                          {activeTab === "organized" ? "Organizer" : "Attendee"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin size={16} className="mr-1" />
                        Virtual Event
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <Avatar
                              key={i}
                              className="border-2 border-background w-8 h-8"
                            >
                              <AvatarImage
                                src={`/placeholder.?svg?height=32&width=32&text=${
                                  i + 1
                                }`}
                              />
                              <AvatarFallback>U{i + 1}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary"
                        >
                          View Details{" "}
                          <ChevronRight size={16} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))} */}
                  {memoizedEvents && memoizedEvents.length > 0 ? (
                    loading ? (
                      <div className="py-[10rem] flex flex-col justify-center items-center">
                        <h1>Loading....</h1>
                      </div>
                    ) : (
                      <>
                        {memoizedEvents?.map((event) => (
                          <div
                            key={event.id}
                            className="p-4 hover:bg-muted/50 transition-colors flex flex-col gap-2"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {event.event_title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(
                                    event.event_startdate
                                  ).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin size={16} className="mr-1" />
                                  {event.event_location}
                                </div>
                              </div>
                              <Badge variant="outline">Organizer</Badge>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-[8rem] text-white"
                            >
                              <Link href={`/events/${event.id}`}>
                                View Details{" "}
                                <ChevronRight size={16} className="ml-1" />
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </>
                    )
                  ) : (
                    <div className="p-10 text-center text-muted-foreground">
                      No events found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
