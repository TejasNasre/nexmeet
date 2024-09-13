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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

function Page({ params }: { params: { id: any } }) {
  const [participants, setParticipants]: any = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipant = async () => {
      let { data: event_participants, error } = await supabase
        .from("event_participants")
        .select("*")
        .eq("event_id", params.id);

      if (error) {
        console.log(error);
      } else {
        setParticipants(event_participants);
        setLoading(false);
      }
    };
    fetchParticipant();
  }, [params.id]);

  // console.log(participants);

  const filteredParticipants = participants.filter(
    (participant: any) =>
      participant.participant_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      participant.participant_email
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="absolute top-0 w-full h-screen bg-black text-white py-[8rem] px-8 flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          Participant Details
        </h1>
        <Input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm mx-auto bg-black text-white border-white"
        />
        <div className="rounded-lg border h-full border-white overflow-auto">
          <ScrollArea className="h-full overflow-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-black hover:bg-gray-800">
                  <TableHead className="text-gray-100">Name</TableHead>
                  <TableHead className="text-gray-100">Email</TableHead>
                  <TableHead className="text-gray-100">Contact</TableHead>
                  <TableHead className="text-gray-100">Registered At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="h-full">
                    <TableCell
                      colSpan={4}
                      className="w-full h-full flex justify-center items-center"
                    >
                      Loading Data Please Wait..
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredParticipants.map((participant: any) => (
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
                  </>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

export default Page;
