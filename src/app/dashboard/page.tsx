"use client";

import React, { useEffect, useMemo, useState } from "react";
import { userDetails } from "../../action/userDetails";
import Loading from "../../components/loading";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  CalendarDays,
  MapPin,
  Users,
  Star,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { mergeConfigs } from "tailwind-merge";
import Organisedevent from "@/components/Organisedevent";
import Participatedevent from "@/components/Participatedevent";
import { supabase } from "@/utils/supabase";

interface User {
  id: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("organized");

  const [organisedEvent, setOrganisedEvent] = useState<any[] | null>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userDetails()
      .then((res: any) => {
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
      let { data: organised_events, error } = await supabase
        .from("event_details")
        .select("*")
        .eq("organizer_email", user?.email);

      if (error) {
        console.log(error);
      }
      {
        setLoading(true);
        setOrganisedEvent(organised_events);
        setLoading(false);
      }
    };

    organizeEvents();
  }, [user]);

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
                    {organisedEvent?.length ? organisedEvent.length : 0}
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
                <Link href="/add-event">Organised Your Own Event</Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Link href="/explore-events">View All Events</Link>
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
                  {activeTab === "organized" ? (
                    <Organisedevent user={user?.email} />
                  ) : (
                    <Participatedevent user={user?.email} />
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
