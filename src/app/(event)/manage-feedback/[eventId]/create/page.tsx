"use client";

import React from "react";
import { supabase } from "@/utils/supabase";
import { useState, useTransition, useEffect } from "react";
import { userDetails } from "@/action/userDetails";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  TextInputField,
  RatingField,
  SliderField,
  MCQField,
  RadioField,
} from "@/components/form-fields/form-fields";

interface User {
  id: string;
  email: string;
}

interface FormField {
  type: string;
  label: string;
  value: string | number;
  options?: string[];
  newOptionValue?: string;
}

export default function CreateFeedbackForm() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId;

  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [currentFieldType, setCurrentFieldType] = useState<string>("text");
  const [formTitle, setFormTitle] = useState<string>("");

  useEffect(() => {
    userDetails()
      .then((res: any) => {
        setUser(res);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const handleAddField = () => {
    const newField: FormField = {
      type: currentFieldType,
      label: "",
      value: "",
      options:
        currentFieldType === "mcq" || currentFieldType === "radio"
          ? ["Option 1", "Option 2"]
          : undefined,
    };
    setFormFields([...formFields, newField]);
  };
  const handleLabelChange = (index: number, newLabel: string) => {
    const updatedFields = formFields.map((field, idx) => {
      if (idx === index) {
        return { ...field, label: newLabel };
      }
      return field;
    });
    setFormFields(updatedFields);
  };

  const handleInputChange = (index: number, newValue: string | number) => {
    const updatedFields = formFields.map((field, idx) => {
      if (idx === index) {
        return { ...field, value: newValue };
      }
      return field;
    });
    setFormFields(updatedFields);
  };

  const handleDeleteField = (index: number) => {
    const updatedFields = formFields.filter((_, idx) => idx !== index);
    setFormFields(updatedFields);
  };

  const handleFieldTypeChange = (value: string) => {
    setCurrentFieldType(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user exists and has an id
    if (!user || !user.id) {
      console.error("No user found:", user);
      router.push("/unauthorized");
      return;
    }

    if (!formTitle.trim()) {
      alert("Please enter a form title");
      return;
    }

    if (formFields.length === 0) {
      alert("Please add at least one field to your form");
      return;
    }

    const emptyLabelField = formFields.find((field) => !field.label.trim());
    if (emptyLabelField) {
      alert("All fields must have labels");
      return;
    }

    startTransition(async () => {
      try {
        const { data: formData, error: formError } = await supabase
          .from("feedback_forms")
          .insert([
            {
              title: formTitle,
              created_by: user?.email,
              event_id: eventId || null,
            },
          ])
          .select()
          .single();

        if (formError) {
          console.error("Form creation error:", formError);
          throw formError;
        }

        if (!formData) {
          throw new Error("No data returned from form creation");
        }

        const formFieldData = formFields.map((field) => ({
          form_id: formData.id,
          field_type: field.type,
          label: field.label,
          options: field.options || null,
        }));

        const { error: fieldsError } = await supabase
          .from("form_fields")
          .insert(formFieldData);

        if (fieldsError) throw fieldsError;

        router.push(`/forms/${formData.id}`);
      } catch (error) {
        console.error("Error creating form:", error);
        alert("Failed to create form. Please try again.");
      }
    });
  };

  const handleAddOption = (fieldIndex: number, newOption: string) => {
    setFormFields(
      formFields.map((field, idx) => {
        if (idx === fieldIndex) {
          const updatedOptions = [...(field.options || []), newOption];
          return { ...field, options: updatedOptions };
        }
        return field;
      })
    );
  };

  const handleDeleteOption = (fieldIndex: number, optionIndex: number) => {
    setFormFields(
      formFields.map((field, idx) => {
        if (idx === fieldIndex) {
          const updatedOptions =
            field.options?.filter((_, optIdx) => optIdx !== optionIndex) || [];
          return { ...field, options: updatedOptions };
        }
        return field;
      })
    );
  };

  const handleOptionChange = (
    fieldIndex: number,
    optionIndex: number,
    newValue: string
  ) => {
    setFormFields(
      formFields.map((field, idx) => {
        if (idx === fieldIndex) {
          const updatedOptions =
            field.options?.map((option, optIdx) =>
              optIdx === optionIndex ? newValue : option
            ) || [];
          return { ...field, options: updatedOptions };
        }
        return field;
      })
    );
  };

  const renderField = (field: FormField, index: number) => {
    const commonProps = {
      label: field.label,
      onChange: (value: string | number) => handleInputChange(index, value),
    };

    switch (field.type) {
      case "text":
        return <TextInputField {...commonProps} />;
      case "rating":
        return <RatingField {...commonProps} />;
      case "slider":
        return <SliderField {...commonProps} min={1} max={10} />;
      case "mcq":
        return (
          <MCQField
            {...commonProps}
            options={field.options || []}
            onAddOption={(option) => handleAddOption(index, option)}
            onDeleteOption={(optionIdx) => handleDeleteOption(index, optionIdx)}
            onOptionChange={(optionIdx, value) =>
              handleOptionChange(index, optionIdx, value)
            }
          />
        );
      case "radio":
        return (
          <RadioField
            {...commonProps}
            options={field.options || ["Option 1", "Option 2"]}
            onAddOption={(option) => handleAddOption(index, option)}
            onDeleteOption={(optionIdx) => handleDeleteOption(index, optionIdx)}
            onOptionChange={(optionIdx, value) =>
              handleOptionChange(index, optionIdx, value)
            }
          />
        );
      default:
        return null;
    }
  };

  return isAuthenticated ? (
    <div className="w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col flex-wrap gap-10 md:w-2/3"
      >
        <h1 className="text-2xl md:text-4xl font-extrabold text-center">
          Create a Feedback Form
        </h1>
        <div className="mt-6">
          <div className="space-y-2 mt-3">
            <label>Enter Form Title</label>
            <Input
              type="text"
              placeholder="Form Title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="border p-2 w-full rounded-md"
            />
          </div>
          {formFields.map((field, index) => (
            <div key={index} className="space-y-5 mt-3">
              <Input
                type="text"
                placeholder="Enter field label"
                value={field.label}
                onChange={(e) => handleLabelChange(index, e.target.value)}
                className="border p-2 w-full rounded-md"
              />
              <div className="space-y-1">
                <div>{renderField(field, index)}</div>
                <button
                  type="button"
                  onClick={() => handleDeleteField(index)}
                  className="flex gap-2 text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-md transition-all duration-300 ease-in-out"
                >
                  Delete Field
                  <Trash2 className="w-5" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex-col space-y-4 mt-3">
            <Select onValueChange={handleFieldTypeChange} defaultValue="text">
              <SelectTrigger>
                <SelectValue placeholder="Select Field Type" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white">
                <SelectItem value="text">Text Input</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="slider">Slider</SelectItem>
                <SelectItem value="mcq">MCQ</SelectItem>
                <SelectItem value="radio">Radio</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              className="w-full border border-white p-2 rounded-md bg-black text-white hover:bg-white hover:text-black"
              onClick={handleAddField}
            >
              Add Field
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full border border-white p-2 rounded-md bg-black text-white hover:bg-white hover:text-black"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Form"}
        </Button>
      </form>
    </div>
  ) : (
    router.push("/unauthorized")
  );
}
