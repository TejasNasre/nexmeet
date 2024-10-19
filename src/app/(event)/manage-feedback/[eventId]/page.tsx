"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { parseISO, format } from "date-fns";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { toast } from "sonner";


function EventResponsesPage() {
  const params = useParams();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const [responses, setResponses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchResponses = async () => {
      let { data: eventFeedback, error } = await supabase
        .from("event_feedback")
        .select(
          `id,
          respondent_email,
          created_at,
          enjoy_most,
          organization_rating,
          overall_satisfaction,
          recommendation,
          improvement 
        `
        )
        .eq("event_id", params.eventId);

      if (error) {
        console.log(error);
        toast.error("Failed to fetch responses. Please try again.");
      } else {
        setResponses(eventFeedback || []);
        processChartData(eventFeedback || []);
        setLoading(false);
      }
    };
    fetchResponses();
  }, [params.eventId]);

  const processChartData = (data: any[]) => {
    data.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const processedData = data.reduce((acc, curr, index) => {
      const date = format(parseISO(curr.created_at), "MMM dd HH:mm");
      const existingEntry = acc.find((item: any) => item.date === date);

      if (existingEntry) {
        existingEntry.responses = index + 1;
      } else {
        acc.push({ date, responses: index + 1 });
      }

      return acc;
    }, []);

    setChartData(processedData);
  };

  const filteredResponses = responses.filter((response) =>
    response.respondent_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CustomTooltip: React.FC<{
    active: boolean;
    payload: any[];
    label: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md">
          <p className="text-sm font-semibold text-gray-300">{`Date: ${label}`}</p>
          <p className="text-sm text-cyan-400">{`Responses: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full min-h-screen bg-black text-white py-[8rem] px-0 md:px-8 flex flex-col gap-10">
          <h1 className="mb-6 text-3xl font-bold text-center">
            Event Responses
          </h1>
          <>
            <div className="w-full h-auto mb-8">
              <h2 className="mb-4 text-2xl font-bold text-center text-cyan-400">
                Response Count Over Time
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    stroke="#4B5563"
                  />
                  <YAxis
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    stroke="#4B5563"
                  />
                  <Tooltip
                    content={
                      <CustomTooltip active={false} payload={[]} label="" />
                    }
                  />
                  <defs>
                    <linearGradient
                      id="colorResponses"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#06B6D4"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="#06B6D4"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="responses"
                    stroke="#06B6D4"
                    fillOpacity={1}
                    fill="url(#colorResponses)"
                  />
                  <Line
                    type="monotone"
                    dataKey="responses"
                    stroke="#22D3EE"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{
                      r: 8,
                      fill: "#22D3EE",
                      stroke: "#000",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="px-8">
              <label className="flex items-center w-full gap-2 px-4 bg-black border border-white rounded-md">
                <input
                  type="text"
                  className="w-full p-2 text-white bg-black border-0 rounded-md outline-none"
                  placeholder="Search by email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 text-white opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>

            <div className="px-8">
              <div className="h-full overflow-auto border border-white rounded-lg">
                <ScrollArea className="h-full">
                  <Table className="text-white border-separate border-spacing-y-2">
                    <TableHeader className="sticky top-0 bg-black text-white font-bold">
                      <TableRow>
                        <TableHead className="text-left">
                          Respondent Email
                        </TableHead>
                        <TableHead className="text-left">
                          Submission Date
                        </TableHead>
                        <TableHead className="text-left">
                          Enjoyment
                        </TableHead>
                        <TableHead className="text-left">
                          Organization Rating
                        </TableHead>
                        <TableHead className="text-left">
                          Overall Satisfaction
                        </TableHead>
                        <TableHead className="text-left">
                          Recommendations
                        </TableHead>
                        <TableHead className="text-left">
                          Suggestions
                        </TableHead>
                        <TableHead className="text-left"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResponses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center">
                            No feedback found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredResponses.map((response) => (
                          <TableRow key={response.id}>
                            <TableCell>
                              {response.respondent_email}
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(response.created_at),
                                "MMM dd, yyyy hh:mm a"
                              )}
                            </TableCell>
                            <TableCell>
                              {response.enjoy_most} {/* Adjust field names if necessary */}
                            </TableCell>
                            <TableCell>
                              {response.organization_rating} {/* Adjust field names if necessary */}
                            </TableCell>
                            <TableCell>
                              {response.overall_satisfaction} {/* Adjust field names if necessary */}
                            </TableCell>
                            <TableCell>
                              {response.recommendation} {/* Adjust field names if necessary */}
                            </TableCell>
                            <TableCell>
                              {response.improvement} {/* Adjust field names if necessary */}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          </>
        </div>
      )}
    </>
  ) : (
    <h1>Please log in to view this page.</h1>
  );
}

export default EventResponsesPage;
