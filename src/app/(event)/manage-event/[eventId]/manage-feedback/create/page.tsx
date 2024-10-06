"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/utils/supabase";
import { useState, useTransition, useEffect } from "react";
import { userDetails } from "@/action/userDetails";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface FieldProps {
    label: string,
    onChange: any,
    min?: number,
    max?: number,
    options?: any
}

function TextInputField({ label, onChange }: FieldProps) {
    return (
        <div className="mb-4 space-y-2">
            <label>{label}</label>
            <Input placeholder="Enter text" className="w-full border border-white p-2 rounded-md bg-black text-white"
                onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}

function RatingField({ label, onChange }: FieldProps) {
    return (
        <div className="space-y-2">
            <label className="mb-2 block">{label}</label>
            <div className="rating mb-4">
                <input type="radio" name="rating" value="1" className="mask mask-star-2 bg-orange-400" onChange={() => onChange(1)} />
                <input type="radio" name="rating" value="2" className="mask mask-star-2 bg-orange-400" onChange={() => onChange(2)} />
                <input type="radio" name="rating" value="3" className="mask mask-star-2 bg-orange-400" onChange={() => onChange(3)} />
                <input type="radio" name="rating" value="4" className="mask mask-star-2 bg-orange-400" onChange={() => onChange(4)} />
                <input type="radio" name="rating" value="5" className="mask mask-star-2 bg-orange-400" onChange={() => onChange(5)} />
            </div>
        </div>
    );
}

function SliderField({ label, min, max, onChange }: FieldProps) {
    return (
        <div className="mb-4 space-y-2">
            <label>{label}</label>
            <input type="range" min={min} max={max} className="range range-xs w-full" onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}

function MCQField({ label, options, onChange }: FieldProps) {
    return (
        <div className="flex-col space-y-2 mb-2">
            <label>{label}</label>
            {options.map((option, idx: React.Key) => (
                <div className="flex gap-3" key={idx}>
                    <input type="checkbox" className="checkbox checkbox-sm" value={option} onChange={(e) => onChange(e.target.value)} />
                    <label>{option}</label>
                </div>
            ))}
        </div>
    );
}

function RadioField({ label, options, onChange }: FieldProps) {
    return (
        <div className="flex-col space-y-2 mb-2">
            <label>{label}</label>
            {options.map((option, idx: React.Key) => (
                <div className="flex gap-3" key={idx}>
                    <input type="radio" name="radio-1" className="radio" defaultChecked />
                    <label>{option}</label>
                </div>
            ))}
        </div>
    );
}



export default function CreateFeedbackForm() {
    const router = useRouter();
    const params = useParams();
    const { eventId } = params;
  
    const { isAuthenticated, isLoading } = useKindeBrowserClient();

    const [user, setUser]: any = useState(null);
    const [isPending, startTransition] = useTransition();
    const [formFields, setFormFields] = useState([]);
    const [currentFieldType, setCurrentFieldType] = useState('text');
    const [formTitle, setFormTitle] = React.useState('');

    if (isLoading) {
        return <Loading />;
    }

    // Function to handle adding a new field
    const handleAddField = () => {
        setFormFields([...formFields, { type: currentFieldType, label: '', value: '' }]);
    };

    // Function to handle changing the label of a specific field
    const handleLabelChange = (index: number, newLabel: string) => {
        const updatedFields = formFields.map((field, idx) => {
            if (idx === index) {
                return { ...field, label: newLabel };
            }
            return field;
        });
        setFormFields(updatedFields);
    };

    // Function to handle input change for dynamic fields
    const handleInputChange = (index: React.Key, newValue: any) => {
        const updatedFields = formFields.map((field, idx) => {
            if (idx === index) {
                return { ...field, value: newValue };
            }
            return field;
        });
        setFormFields(updatedFields);
    };

    // Function to delete a field
    const handleDeleteField = (index: number) => {
        const updatedFields = formFields.filter((_, idx) => idx !== index);
        setFormFields(updatedFields);
    };
    const handleFieldTypeChange = (value: React.SetStateAction<string>) => {
        setCurrentFieldType(value);
    };

    const renderField = (field: any, index: React.Key) => {
        switch (field.type) {
            case 'text':
                return (
                    <TextInputField
                        label={field.label}
                        onChange={(value: any) => handleInputChange(index, value)}
                        key={index}
                    />
                );
            case 'rating':
                return (
                    <RatingField
                        label={field.label}
                        onChange={(value: any) => handleInputChange(index, value)}
                        key={index}
                    />
                );
            case 'slider':
                return (
                    <SliderField
                        label={field.label}
                        min={1}
                        max={10}
                        onChange={(value: any) => handleInputChange(index, value)}
                        key={index}
                    />
                );
            case 'mcq':
                return (
                    <MCQField
                        label={field.label}
                        options={["Option 1", "Option 2"]}
                        onChange={(value: any) => handleInputChange(index, value)}
                        key={index}
                    />
                );
            case 'radio':
                return (
                    <RadioField
                        label={field.label}
                        options={["Yes", "No"]}
                        onChange={(value: any) => handleInputChange(index, value)}
                        key={index}
                    />
                );
            default:
                return null;
        }
    };

    return isAuthenticated ? (
        <>
            <div className="w-full h-auto bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-center items-center">
                <form
                    className="w-full flex flex-col flex-wrap gap-10 md:w-2/3"
                >
                    <h1 className="text-2xl md:text-4xl font-extrabold text-center">
                        Create a Feedback Form
                    </h1>
                    <div className="mt-6">
                        {/* Default field for the form name */}
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

                        {/* Map through the other form fields */}
                        {formFields.map((field, index) => (
                            <div key={index} className="space-y-5 mt-3">
                                {/* Input for setting the label */}
                                <Input
                                    type="text"
                                    placeholder="Enter field label"
                                    value={field.label}
                                    onChange={(e) => handleLabelChange(index, e.target.value)}
                                    className="border p-2 w-full rounded-md"
                                />

                                {/* Render the field based on its type */}
                                <div className="space-y-1">
                                    <div>
                                        {renderField(field, index)}
                                    </div>
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
        </>
    ) : (
        router.push("/unauthorized")
    );
}
