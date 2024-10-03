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
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { toast } from "sonner";

function Page({ params }: { params: { id: any } }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const [participants, setParticipants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchParticipant = async () => {
      let { data: event_participants, error } = await supabase
        .from("event_participants")
        .select("*")
        .eq("event_id", params.id);

      if (error) {
        console.log(error);
        toast.error("Failed to fetch participants. Please try again.");
      } else {
        setParticipants(event_participants || []);
        processChartData(event_participants ?? []);
        setLoading(false);
      }
    };
    fetchParticipant();
  }, [params.id]);

  const processChartData = (data: any[]) => {
    // Sort the data by created_at
    data.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Process the data to count cumulative participants over time
    const processedData = data.reduce((acc, curr, index) => {
      const date = format(parseISO(curr.created_at), "MMM dd HH:mm");
      const existingEntry = acc.find((item: any) => item.date === date);

      if (existingEntry) {
        existingEntry.participants = index + 1;
      } else {
        acc.push({ date, participants: index + 1 });
      }

      return acc;
    }, []);

    setChartData(processedData);
  };

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.participant_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      participant.participant_email
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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
          <p className="text-sm text-cyan-400">{`Participants: ${payload[0].value}`}</p>
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
        <div className="  w-full min-h-screen bg-black text-white py-[8rem] px-0 md:px-8 flex flex-col gap-10">
          <h1 className="mb-6 text-3xl font-bold text-center">
            Participant Details
          </h1>

          <div className="w-full h-auto mb-8">
            <h2 className="mb-4 text-2xl font-bold text-center text-cyan-400">
              Participant Growth Over Time
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
                    id="colorParticipants"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="participants"
                  stroke="#06B6D4"
                  fillOpacity={1}
                  fill="url(#colorParticipants)"
                />
                <Line
                  type="monotone"
                  dataKey="participants"
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
                placeholder="Search by name or email"
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
              <ScrollArea className="h-full overflow-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="bg-black hover:bg-gray-800">
                      <TableHead className="text-gray-100">Name</TableHead>
                      <TableHead className="text-gray-100">Email</TableHead>
                      <TableHead className="text-gray-100">Contact</TableHead>
                      <TableHead className="text-gray-100">
                        Registered At
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map((participant) => (
                      <TableRow
                        key={participant.id}
                        className="cursor-pointer hover:bg-gray-800"
                      >
                        <TableCell className="font-medium">
                          {participant.participant_name}
                        </TableCell>
                        <TableCell>{participant.participant_email}</TableCell>
                        <TableCell>{participant.participant_contact}</TableCell>
                        <TableCell>
                          {new Date(participant.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    router.push("/unauthorized")
  );
}

export default Page;
