"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/form-fields/form-fields";

interface FormField {
  id: string;
  field_type: string;
  label: string;
  options?: string[];
}

interface Responses {
  [key: string]: string | number | string[]; // Allow string array for MCQ
}

function MCQField({
  label,
  options = [],
  onChange,
  selectedValues = [],
}: {
  label: string;
  options: string[];
  onChange: (value: string[]) => void; // Updated to accept string array
  selectedValues: string[]; // Array to track selected values
}) {
  const handleCheckboxChange = (option: string) => {
    let updatedValues;
    if (selectedValues.includes(option)) {
      // Remove option if already selected
      updatedValues = selectedValues.filter((val) => val !== option);
    } else {
      // Add option if not selected
      updatedValues = [...selectedValues, option];
    }
    onChange(updatedValues); // Pass the updated array to the parent
  };

  return (
    <div className="flex-col space-y-2 mb-2">
      <label>{label}</label>
      {options.map((option, idx) => (
        <div className="flex gap-3 items-center" key={idx}>
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            value={option}
            checked={selectedValues.includes(option)} // Keep track of checked state
            onChange={() => handleCheckboxChange(option)}
          />
          <span>{option}</span>
        </div>
      ))}
    </div>
  );
}

function RadioField({
  label,
  options = [],
  onChange,
}: {
  label: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex-col space-y-2 mb-2">
      <label>{label}</label>
      {options.map((option, idx) => (
        <div className="flex gap-3 items-center" key={idx}>
          <input
            type="radio"
            name={`radio-${label}`}
            className="radio"
            value={option}
            onChange={() => onChange(option)}
          />
          <span>{option}</span>
        </div>
      ))}
    </div>
  );
}

export default function ResponseForm() {
  const params = useParams();
  const formId = params?.formId;
  const { user, isAuthenticated } = useKindeBrowserClient();

  const [formTitle, setFormTitle] = useState<string>("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [responses, setResponses] = useState<Responses>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchForm() {
      if (!formId) return;

      const { data: formData } = await supabase
        .from("feedback_forms")
        .select("title")
        .eq("id", formId)
        .single();

      if (formData) {
        setFormTitle(formData.title);
      }

      const { data: fieldData } = await supabase
        .from("form_fields")
        .select("*")
        .eq("form_id", formId);

      if (fieldData) {
        setFields(fieldData);
      }
    }

    fetchForm();
  }, [formId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || !formId) return;

    try {
      const { data: responseData, error: responseError } = await supabase
        .from("form_responses")
        .insert([
          {
            form_id: formId,
            respondent_email: user?.email,
          },
        ])
        .select()
        .single();

      if (responseError) throw responseError;

      const responseFields = Object.entries(responses).flatMap(
        ([fieldId, value]) => {
          if (Array.isArray(value)) {
            // If value is an array (MCQ), create a response for each selected option
            return value.map((v) => ({
              response_id: responseData.id,
              field_id: fieldId,
              value: v,
            }));
          } else {
            // Handle non-MCQ fields
            return {
              response_id: responseData.id,
              field_id: fieldId,
              value: value.toString(),
            };
          }
        }
      );

      const { error: fieldsError } = await supabase
        .from("response_fields")
        .insert(responseFields);

      if (fieldsError) throw fieldsError;

      console.log("Response submitted successfully");
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  const renderField = (field: FormField) => {
    switch (field.field_type) {
      case "text":
        return (
          <div className="mb-4">
            <label className="block mb-2">{field.label}</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setResponses({ ...responses, [field.id]: e.target.value })
              }
            />
          </div>
        );
      case "rating":
        return (
          <div className="mb-4">
            <label className="block mb-2">{field.label}</label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <input
                  key={value}
                  type="radio"
                  name={`rating-${field.id}`}
                  className="mask mask-star-2 bg-orange-400"
                  onChange={() =>
                    setResponses({ ...responses, [field.id]: value.toString() })
                  }
                />
              ))}
            </div>
          </div>
        );
      case "slider":
        return (
          <SliderField
            label={field.label}
            min={1}
            max={100}
            onChange={(value) =>
              setResponses({ ...responses, [field.id]: value })
            }
          />
        );
      case "mcq":
        return (
          <MCQField
            label={field.label}
            options={field.options || []}
            selectedValues={
              Array.isArray(responses[field.id])
                ? (responses[field.id] as string[])
                : []
            } // Ensure it's always an array
            onChange={(value) =>
              setResponses({ ...responses, [field.id]: value })
            }
          />
        );
      case "radio":
        return (
          <RadioField
            label={field.label}
            options={field.options || []}
            onChange={(value) =>
              setResponses({ ...responses, [field.id]: value })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">{formTitle}</h1>
      <form
        className="w-full flex flex-col flex-wrap gap-10 md:w-2/3"
        onSubmit={handleSubmit}
      >
        {fields.map((field) => (
          <div key={field.id} className="mb-4">
            {renderField(field)}
          </div>
        ))}
        <Button
          type="submit"
          className="w-full border border-white p-2 rounded-md bg-black text-white hover:bg-white hover:text-black"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit Form"}
        </Button>
      </form>
    </div>
  );
}
