"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase";

interface ResponseField {
  field_id: string;
  value: string; // Stores the selected value for a specific response
}

interface FormField {
  id: string;
  label: string;
  field_type: string; // Can be 'rate', 'mcq', 'slider', 'text', 'radio'
}

export default function ViewResponse() {
  const { responseId } = useParams(); // Get response ID from URL params
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [responseFields, setResponseFields] = useState<ResponseField[]>([]);
  const [formTitle, setFormTitle] = useState<string>("");
  const [respondentEmail, setRespondentEmail] = useState<string>("");

  useEffect(() => {
    const fetchResponseData = async () => {
      if (!responseId) return;

      try {
        // Fetch response data
        const { data: responseData, error: responseError } = await supabase
          .from("form_responses")
          .select("*")
          .eq("id", responseId)
          .single();

        if (responseError) throw responseError;

        setRespondentEmail(responseData.respondent_email);

        // Fetch form title
        const { data: formData } = await supabase
          .from("feedback_forms")
          .select("title")
          .eq("id", responseData.form_id)
          .single();

        setFormTitle(formData?.title || "");

        // Fetch form fields
        const { data: fieldsData } = await supabase
          .from("form_fields")
          .select("*")
          .eq("form_id", responseData.form_id);

        setFormFields(fieldsData || []);

        // Fetch user responses
        const { data: responseFieldsData } = await supabase
          .from("response_fields")
          .select("*")
          .eq("response_id", responseId);

        setResponseFields(responseFieldsData || []);
      } catch (error) {
        console.error("Error fetching response data:", error);
      }
    };
    fetchResponseData();
  }, [responseId]);

  const renderResponse = (field: FormField) => {
    const userResponses = responseFields.filter(
      (response) => response.field_id === field.id
    );
    const responseValue =
      userResponses.length > 0 ? userResponses[0].value : "No response";

    switch (field.field_type) {
      case "text":
        return (
          <div key={field.id} className="mb-4">
            <h3 className="font-bold">{field.label}</h3>
            <p>{responseValue}</p>
          </div>
        );

      case "rate":
        return (
          <div key={field.id} className="mb-4">
            <h3 className="font-bold">{field.label}</h3>
            <p>Rating: {responseValue}</p>
          </div>
        );

      case "mcq":
        return (
          <div key={field.id} className="mb-4">
            <h3 className="font-bold">{field.label}</h3>
            <ul>
              {userResponses.length > 0 ? (
                userResponses.map((response, idx) => (
                  <li key={idx}>{response.value}</li>
                ))
              ) : (
                <p>No options selected</p>
              )}
            </ul>
          </div>
        );

      case "radio":
        return (
          <div key={field.id} className="mb-4">
            <h3 className="font-bold">{field.label}</h3>
            <p>Selected: {responseValue}</p>
          </div>
        );

      case "slider":
        return (
          <div key={field.id} className="mb-4">
            <h3 className="font-bold">{field.label}</h3>
            <p>Slider value: {responseValue}</p>
          </div>
        );

      default:
        return (
          <div key={field.id} className="mb-4">
            <h3 className="font-bold">{field.label}</h3>
            <p>{responseValue}</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">{formTitle}</h1>
      <p className="text-md mb-4">Respondent: {respondentEmail}</p>
      <div className="w-full md:w-2/3 bg-black p-4 rounded-lg shadow-md">
        {formFields.map((field) => renderResponse(field))}
      </div>
    </div>
  );
}
