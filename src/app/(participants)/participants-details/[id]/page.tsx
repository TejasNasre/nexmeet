"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabase";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { toast } from "sonner";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, parseISO } from "date-fns";

function Page({ params }: { params: { id: any } }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useKindeBrowserClient();

  const [participants, setParticipants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusChartData, setStatusChartData] = useState<any[]>([]);
  const [registrationTrendData, setRegistrationTrendData] = useState<any[]>([]);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    const fetchParticipants = async () => {
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
      }
    };

    const fetchEventDetails = async () => {
      const { data: eventDetails, error } = await supabase
        .from("event_details")
        .select("organizer_email")
        .eq("id", params.id)
        .single();

      if (error) {
        console.log(error);
        toast.error("Failed to fetch event details. Please try again.");
      } else {
        if (eventDetails.organizer_email === user?.email) {
          setIsOrganizer(true);
        }
      }
    };

    const fetchData = async () => {
      if (isAuthenticated) {
        await fetchParticipants();
        await fetchEventDetails();
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, isAuthenticated, user]);

  const processChartData = (data: any[]) => {
    // Status chart data
    const totalParticipants = data.length;
    const approvedParticipants = data.filter(
      (p) => p.is_approved === true
    ).length;
    const rejectedParticipants = data.filter(
      (p) => p.is_approved === false
    ).length;
    const pendingParticipants = data.filter(
      (p) => p.is_approved === null
    ).length;

    setStatusChartData([
      { name: "Total", value: totalParticipants },
      { name: "Approved", value: approvedParticipants },
      { name: "Pending", value: pendingParticipants },
      { name: "Rejected", value: rejectedParticipants },
    ]);

    // Registration trend data
    const sortedData = [...data].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const trendData = sortedData.reduce(
      (acc: any[], curr: any, index: number) => {
        const date = format(parseISO(curr.created_at), "yyyy-MM-dd");
        const existingEntry = acc.find((item) => item.date === date);
        if (existingEntry) {
          existingEntry.count += 1;
        } else {
          acc.push({ date, count: 1 });
        }
        return acc;
      },
      []
    );

    setRegistrationTrendData(trendData);
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

  const handleApproval = async (id: string, status: boolean) => {
    try {
      const { error } = await supabase
        .from("event_participants")
        .update({ is_approved: status })
        .eq("id", id);

      if (error) {
        toast.error("Failed to update approval status.");
        return;
      }

      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant.id === id
            ? { ...participant, is_approved: status }
            : participant
        )
      );
      toast.success(`Participant ${status ? "accepted" : "rejected"}!`);

      const { data: updatedParticipant, error: fetchError } = await supabase
        .from("event_participants")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error(
          "Failed to fetch updated participant details:",
          fetchError
        );
        toast.error("Failed to fetch updated participant details.");
        return;
      }

      const { data: eventDetails, error: eventError } = await supabase
        .from("event_details")
        .select("*")
        .eq("id", updatedParticipant.event_id)
        .single();

      if (eventError) {
        console.error("Failed to fetch event details:", eventError);
        toast.error("Failed to fetch event details.");
        return;
      }

      try {
        await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "participant-approval",
            eventDetails: eventDetails,
            participant: updatedParticipant,
            isApproved: status,
          }),
        });
        toast.success("Approval/rejection email sent successfully!");
      } catch (emailError) {
        console.error("Failed to send approval/rejection email:", emailError);
        toast.error("Failed to send approval/rejection email");
      }

      // Update chart data after approval/rejection
      processChartData(participants);
    } catch (error) {
      console.error("Error in handleApproval:", error);
      toast.error("An error occurred while processing the approval");
    }
  };

  const convertToCSV = (data: any[]) => {
    const headers = [
      "Name",
      "Email",
      "Contact",
      "Account Holder",
      "Transaction ID",
      "Registration Date",
      "Registration Time",
      "Status",
    ];
    const rows = data.map((participant) => [
      participant.participant_name,
      participant.participant_email,
      participant.participant_contact,
      participant.account_holder_name,
      participant.transaction_id,
      new Date(participant.created_at).toLocaleString(),
      participant.is_approved === true
        ? "Approved"
        : participant.is_approved === false
          ? "Rejected"
          : "Pending",
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    return csvContent;
  };

  const downloadCSV = () => {
    const csvContent = convertToCSV(participants);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `participants_${params.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md">
          <p className="text-sm font-semibold text-gray-300">{`${label}`}</p>
          <p className="text-sm text-cyan-400">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading || loading) {
    return <Loading />;
  }

  return isAuthenticated && isOrganizer ? (
    <div className="w-full min-h-screen bg-black text-white py-[8rem] px-0 md:px-8 flex flex-col gap-10">
      <h1 className="text-5xl md:text-7xl font-bold mb-12 text-center tracking-tight font-spaceGrotesk">
        Participant Details
      </h1>

      <div className="w-full flex flex-col px-4 md:flex-row justify-center items-center gap-4">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Participant Status Overview</CardTitle>
            <CardDescription>
              Summary of participant registration statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Registration Trend</CardTitle>
            <CardDescription>Number of registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={registrationTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#06B6D4"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="px-2">
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

      <div className="px-2">
        <div className="w-full flex flex-col md:flex-row md:gap-10 md:justify-start md:items-center">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Download Participants
          </button>
          <div className="md:flex flex-col md:flex-row gap-4 my-4">
            <div>Total Participants: {participants.length}</div>
            <div>
              Approved: {participants.filter((p) => p.is_approved).length}
            </div>
            <div>
              Rejected:{" "}
              {participants.filter((p) => p.is_approved === false).length}
            </div>
            <div>
              Pending:{" "}
              {participants.filter((p) => p.is_approved === null).length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                  Participant Name
                </th>
                <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                  Contact
                </th>
                <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                  Profile Link
                </th>
                <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                  Account Holder
                </th>
                <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                  Transaction ID
                </th>
                <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                  Registered At
                </th>
                <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant) => (
                <tr
                  key={participant.id}
                  className="cursor-pointer hover:bg-gray-800"
                >
                  <td className="px-4 py-2 border border-gray-200">
                    {participant.participant_name}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {participant.participant_contact}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {participant.participant_email}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    <Link
                      href={participant.profile_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500"
                    >
                      View Profile
                    </Link>
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {participant.account_holder_name || "No Data"}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {participant.transaction_id || "No Data"}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {new Date(participant.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {participant.is_approved === true ? (
                      <span className="text-green-500">Approved</span>
                    ) : participant.is_approved === false ? (
                      <span className="text-red-500">Rejected</span>
                    ) : (
                      <span className="text-yellow-500">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {isOrganizer && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproval(participant.id, true)}
                          className="px-2 py-1 text-white bg-green-500 rounded-md hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleApproval(participant.id, false)}
                          className="px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    router.push("/unauthorized")
  );
}

export default Page;
