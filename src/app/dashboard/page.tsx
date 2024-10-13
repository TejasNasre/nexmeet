"use client";

import React, { useEffect, useState } from "react";
import { userDetails } from "../../action/userDetails";
import Loading from "../../components/loading";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { CalendarDays, Users, Star, TrendingUp } from "lucide-react";

import Link from "next/link";
import Organisedevent from "@/components/Organisedevent";
import Participatedevent from "@/components/Participatedevent";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Label, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

interface User {
  id: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
}

interface ChartDataItem {
  category: string;
  eventcount: number;
  fill: string;
}
const categoryColors = {
  technical: "var(--color-chrome)",
  cultural: "var(--color-safari)",
  conference: "var(--color-firefox)",
  sports: "var(--color-edge)",
  meetup: "var(--color-other)",
};
export default function Page() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const [activeTab, setActiveTab] = useState("organized");
  const [organisedEvent, setOrganisedEvent]: any = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [eventcount, seteventCount] = useState('');

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

      const categoryCounts = data.reduce<Record<string, number>>((acc, curr) => {
        acc[curr.event_category] = (acc[curr.event_category] || 0) + 1;
        return acc;
      }, {});

      const formattedChartData: ChartDataItem[] = Object.entries(categoryCounts).map(([category, count]) => ({
        category,
        eventcount: count,
        fill: categoryColors[category as keyof typeof categoryColors] || "var(--color-other)",
      }));
      seteventCount(data.length.toString());
      setChartData(formattedChartData);
      setLoading(false);
    };

    fetchEventStats();
  }, []);

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
      }
      {
        // console.log(organised_events);
        setLoading(true);
        setOrganisedEvent(organised_events);
        setLoading(false);
      }
    };

    organizeEvents();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <>
      <div className="  w-full h-auto bg-black text-white py-[8rem] flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col justify-start items-center gap-24 md:border md:border-white rounded-md p-10">
            <h1 className="text-center text-4xl font-bold">Your Profile</h1>
            {loading ? (
              <Loading />
            ) : user ? (
              <div className="flex flex-col justify-center items-center gap-4">
                <Image
                  src={user.picture || "/profile.jpg"}
                  alt={`${user.given_name} ${user.family_name}`}
                  width={96}
                  height={96}
                  className="rounded-full border-2 border-white"
                />
                <h1>
                  {user.given_name} {user.family_name}
                </h1>
                <h2>{user.email}</h2>
                <LogoutLink
                  className="mono transition ease-in-out delay-100 hover:scale-105 border-double border-2 hover:border-white hover:shadow-[5px_5px_0px_0px_rgb(255,255,255)] rounded-md px-4 py-1"
                  postLogoutRedirectURL="/"
                >
                  Log out
                </LogoutLink>
              </div>
            ) : (
              <h1>No user details available</h1>
            )}
          </div>
          <div className="flex-grow space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Total Events</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip 
                        cursor={false}
                        content={<ChartTooltipContent hideLabel className="bg-black"/>}
                      />
                      <Pie
                        data={chartData}
                        dataKey="eventcount"
                        nameKey="category"
                        innerRadius={60}
                        strokeWidth={5}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-white text-3xl font-bold"
                                  >
                                    {eventcount.toLocaleString()}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-white"
                                  >
                                    Events
                                  </tspan>
                                </text>
                              )
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
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
  ) : (
    router.push("/unauthorized")
  );
}
