"use client";

import React, { useEffect, useState } from "react";
import { userDetails } from "../../action/userDetails";
import Loading from "../../components/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Organisedevent from "@/components/Organisedevent";
import Participatedevent from "@/components/Participatedevent";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface User {
  id: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
}

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const [activeTab, setActiveTab] = useState("organized");
  const [organisedEvent, setOrganisedEvent]: any = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalEventCount, setTotalEventCount] = useState(0);

  const [eventcount, seteventCount] = useState("");
  const [participantionCount, setParticipantionCount] = useState(0);

  const { getPermission } = useKindeBrowserClient();
  const isSuperAdmin = getPermission("events:approve");

  useEffect(() => {
    userDetails()
      .then((res: any) => {
        // console.log(res);
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
      } else {
        setTotalEventCount(organised_events?.length || 0);
        setLoading(true);
        setOrganisedEvent(organised_events);
        setLoading(false);
      }
    };
    organizeEvents();
  }, [user]);

  useEffect(() => {
    const fetchEventStats = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("event_details")
        .select("event_category, id");

      if (error) {
        console.error("Error fetching event data:", error);
        setLoading(false);
        return;
      }

      if (!data) {
        setLoading(false);
        return;
      }

      seteventCount(data.length.toString());
      setLoading(false);
    };

    fetchEventStats();
  }, []);

  useEffect(() => {
    const fetchEventParticipants = async () => {
      let { data: event_participants, error } = await supabase
        .from("event_participants")
        .select("participant_email")
        .eq("participant_email", user?.email);

      setParticipantionCount(event_participants?.length || 0);
    };

    fetchEventParticipants();
  });

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <>
      <div className="w-full h-auto bg-black text-white py-[8rem] flex flex-col">
        <h1 className="text-5xl md:text-7xl font-bold mb-12 text-center tracking-tight font-spaceGrotesk">
          Your Dashboard
        </h1>
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-grow space-y-8">
            <div className="w-full p-2 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
                <Card className="flex flex-col">
                  <CardHeader className="items-center pb-0">
                    <CardTitle>Total Event Organised</CardTitle>
                  </CardHeader>
                  <CardContent className="w-full flex py-4 justify-center item-center">
                    <div className="w-40 h-40 rounded-full border-2 border-white flex flex-col justify-center items-center">
                      <h1 className="text-4xl">{totalEventCount}</h1>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex flex-col">
                  <CardHeader className="items-center pb-0">
                    <CardTitle>Total Event Participation</CardTitle>
                  </CardHeader>
                  <CardContent className="w-full flex py-4 justify-center item-center">
                    <div className="w-40 h-40 rounded-full border-2 border-white flex flex-col justify-center items-center">
                      <h1 className="text-4xl">{participantionCount}</h1>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {isSuperAdmin?.isGranted && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  router.push("/admin");
                }}
              >
                Super Admin
              </Button>
            )}

            <div className="w-full flex flex-col md:flex-row gap-4">
              <Button variant="outline" className="w-full">
                <Link href="/add-event">Organised Your Own Event</Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Link href="/explore-events">View All Events</Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Link href="/explore-event-space">
                  Find Space For Your Next Event
                </Link>
              </Button>
            </div>

            <div>
              <Button variant="outline" className="w-full">
                <Link href="/manage-event">Manage Your Events</Link>
              </Button>
            </div>

            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-muted">
                <div className="flex flex-col gap-8 md:flex-row justify-between items-center">
                  <CardTitle>Your Events</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      className={`${
                        activeTab === "organized" ? "active-tab" : "outline"
                      }`}
                      size="sm"
                      onClick={() => setActiveTab("organized")}
                    >
                      Organized
                    </Button>
                    <Button
                      className={`${
                        activeTab === "participated" ? "active-tab" : "outline"
                      }`}
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
  ) : (
    router.push("/unauthorized")
  );
}
