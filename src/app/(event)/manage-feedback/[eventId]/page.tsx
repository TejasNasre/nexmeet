"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../utils/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
  const [organizationRatings, setOrganizationRatings] = useState<any[]>([]);
  const [satisfactionData, setSatisfactionData] = useState<any[]>([]);
  const [recommendationData, setRecommendationData] = useState<any[]>([]);

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
        processOrganizationRatings(eventFeedback || []);
        processSatisfactionData(eventFeedback || []);
        processRecommendationData(eventFeedback || []);
        setLoading(false);
      }
    };
    fetchResponses();
  }, [params.eventId]);

  const processOrganizationRatings = (data: any[]) => {
    const ratings = data.reduce((acc: any[], curr: any) => {
      const rating = curr.organization_rating;
      const existingEntry = acc.find((item: any) => item.rating === rating);
      if (existingEntry) {
        existingEntry.count++;
      } else {
        acc.push({ rating, count: 1 });
      }
      return acc;
    }, []);
    setOrganizationRatings(ratings);
  };

  const processSatisfactionData = (data: any[]) => {
    const satisfactionLevels = data.reduce((acc: any[], curr: any) => {
      const satisfaction = curr.overall_satisfaction;
      const existingEntry = acc.find(
        (item: any) => item.satisfaction === satisfaction
      );
      if (existingEntry) {
        existingEntry.count++;
      } else {
        acc.push({ satisfaction, count: 1 });
      }
      return acc;
    }, []);
    setSatisfactionData(satisfactionLevels);
  };

  const processRecommendationData = (data: any[]) => {
    const recommendations = data.reduce((acc: any[], curr: any) => {
      const recommendation = curr.recommendation;
      const existingEntry = acc.find(
        (item: any) => item.recommendation === recommendation
      );
      if (existingEntry) {
        existingEntry.count++;
      } else {
        acc.push({ recommendation, count: 1 });
      }
      return acc;
    }, []);
    setRecommendationData(recommendations);
  };

  const filteredResponses = responses.filter((response) =>
    response.respondent_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="w-full h-auto">
                <h2 className="mb-4 text-2xl font-bold text-center text-cyan-400">
                  Organization Ratings
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={organizationRatings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="rating"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", border: "none" }}
                    />
                    <Bar dataKey="count" fill="#06B6D4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full h-auto">
                <h2 className="mb-4 text-2xl font-bold text-center text-cyan-400">
                  Overall Satisfaction
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      dataKey="count"
                      nameKey="satisfaction"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#06B6D4"
                      label
                    >
                      {satisfactionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", border: "none" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full h-auto">
                <h2 className="mb-4 text-2xl font-bold text-center text-cyan-400">
                  Recommendation Scores
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={recommendationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="recommendation"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", border: "none" }}
                    />
                    <Bar dataKey="count" fill="#06B6D4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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

            <div className="overflow-x-auto overflow-y-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                      User Email
                    </th>
                    <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                      Enjoy Most
                    </th>
                    <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                      Rating
                    </th>
                    <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                      Overall Satisfaction
                    </th>
                    <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                      Recommendation
                    </th>
                    <th className="px-4 py-2 text-left text-gray-100 border border-gray-200">
                      Improvement
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResponses.length === 0 ? (
                    <tr>
                      <td className="text-center">No feedback found.</td>
                    </tr>
                  ) : (
                    filteredResponses.map((response) => (
                      <tr
                        key={response.id}
                        className="cursor-pointer hover:bg-gray-800"
                      >
                        <td className="px-4 py-2 border border-gray-200">
                          {response.respondent_email}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {response.enjoy_most}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {response.organization_rating}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {response.overall_satisfaction}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {response.recommendation}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {response.improvement}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
