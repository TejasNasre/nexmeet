"use client";

import React, { useEffect, useState } from "react";
import { userDetails } from "../../action/userDetails";
import Loading from "../../components/loading";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, Star } from "lucide-react";
import Link from "next/link";
import Organisedevent from "@/components/Organisedevent";
import Participatedevent from "@/components/Participatedevent";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend as RadialLegend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface User {
  id: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
}

const registrationData = [
  { name: "18-24", value: 300 },
  { name: "25-34", value: 400 },
  { name: "35-44", value: 200 },
  { name: "45+", value: 100 },
];

const demographicData = [
  { name: "North America ", value: 35 },
  { name: "Europe", value: 30 },
  { name: "Asia", value: 25 },
  { name: "Other", value: 10 },
];

const engagementData = [
  { month: "Jan", rate: 65 },
  { month: "Feb", rate: 59 },
  { month: "Mar", rate: 80 },
  { month: "Apr", rate: 72 },
  { month: "May", rate: 78 },
  { month: "Jun", rate: 85 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const [activeTab, setActiveTab] = useState("organized");
  const [organisedEvent, setOrganisedEvent]: any = useState([]);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden">
              <Card className="flex-col justify-center">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Total Registrations</CardTitle>
                  <CardDescription className="text-center">
                    Registrations categorized by age groups.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Registrations: ",
                        color: "hsl(var(--foreground))",
                      },
                    }}
                    className="w-full aspect-square max-h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        data={registrationData}
                        startAngle={-90}
                        endAngle={380}
                        innerRadius="30%"
                        outerRadius="80%"
                      >
                        <ChartTooltip
                          content={
                            <ChartTooltipContent hideLabel
                              className="bg-black text-foreground"
                            />
                          }
                        />
                        <RadialBar
                          dataKey="value"
                          background
                          label={false}
                        >
                          {registrationData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`hsl(0, 0%, ${100 - (index * 55)}%)`}
                            />
                          ))}
                        </RadialBar>
                        <Legend
                          iconSize={10}
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          wrapperStyle={{
                            fontSize: '12px',
                            color: 'hsl(var(--foreground))'
                          }}
                          formatter={(value, entry, index) => (
                            <span style={{ color: 'hsl(0, 0%, 100%)' }}>
                              {value}
                            </span>
                          )}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center pb-0">
                  <CardTitle>Attendee Demographics</CardTitle>
                  <CardDescription className="text-center">
                    Registrations categorized by location.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Percentage",
                        color: "hsl(var(--foreground))",
                      },
                    }}
                    className="w-full aspect-square max-h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={demographicData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius="80%"
                          dataKey="value"
                        >
                          {demographicData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`hsl(0, 0%, ${100 - (index * 15)}%)`}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={<ChartTooltipContent className="bg-black" />}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: '12px', bottom: 0 }}
                          formatter={(value, entry, index) => (
                            <span style={{ color: 'text-foreground' }}>
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <CardTitle>Engagement Rate</CardTitle>
                  <CardDescription className="text-center">
                    Engagement rate of people.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Engagement Rate",
                        color: "hsl(var(--foreground))",
                      },
                    }}
                    className="w-full aspect-square max-h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={engagementData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--muted-foreground))"
                          opacity={0.5}
                        />
                        <XAxis
                          dataKey="month"
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              className="bg-black text-foreground"
                            />
                          }
                        />
                        <Legend
                          wrapperStyle={{
                            fontSize: '12px',
                            bottom: 0,
                            color: "hsl(var(--foreground))"
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          stroke="hsl(0, 0%, 100%)"
                          strokeWidth={2}
                          dot={{
                            r: 4,
                            strokeWidth: 2,
                            fill: "hsl(var(--background))",
                            stroke: "hsl(0, 0%, 100%)"
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
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
                    <Organisedevent eventDetails={organisedEvent} />
                  ) : (
                    <Participatedevent email={user?.email} />
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
