"use client"
import { useState } from "react";
import { Input } from "../ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface FieldProps {
    label: string;
    onChange: (value: string | number) => void;
    min?: number;
    max?: number;
}

export function TextInputField({ label, onChange }: FieldProps) {
    return (
        <div className="mb-4 space-y-2">
            <label>{label}</label>
            <Input
                placeholder="Enter text"
                className="w-full border border-white p-2 rounded-md bg-black text-white"
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export function RatingField({ label, onChange }: FieldProps) {
    return (
        <div className="space-y-2">
            <label className="mb-2 block">{label}</label>
            <div className="rating mb-4">
                {[1, 2, 3, 4, 5].map((value) => (
                    <input
                        key={value}
                        type="radio"
                        name="rating"
                        value={value}
                        className="mask mask-star-2 bg-orange-400"
                        onChange={() => onChange(value)}
                    />
                ))}
            </div>
        </div>
    );
}

export function SliderField({ label, min = 1, max = 100, onChange }: FieldProps) {
    return (
        <div className="mb-4 space-y-2">
            <label>{label}</label>
            <input
                type="range"
                min={min}
                max={max}
                className="range range-xs w-full"
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </div>
    );
}

export function MCQField({
    label,
    options = [],
    onChange,
    onAddOption,
    onDeleteOption,
    onOptionChange,
}: {
    label: string;
    options: string[];
    onChange: (value: string) => void;
    onAddOption: (option: string) => void;
    onDeleteOption: (idx: number) => void;
    onOptionChange: (idx: number, value: string) => void;
}) {
    const [newOption, setNewOption] = useState("");

    return (
        <div className="flex-col space-y-2 mb-2">
            <label>{label}</label>
            {options.map((option, idx) => (
                <div className="flex gap-3 items-center" key={idx}>
                    <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        value={option}
                        onChange={() => onChange(option)}
                    />
                    <Input
                        value={option}
                        onChange={(e) => onOptionChange(idx, e.target.value)}
                        className="flex-grow"
                    />
                    <button 
                        type="button" 
                        onClick={() => onDeleteOption(idx)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
            <div className="flex items-center gap-2">
                <Input
                    placeholder="New option"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    className="flex-grow"
                />
                <Button
                    type="button"
                    onClick={() => {
                        if (newOption.trim()) {
                            onAddOption(newOption);
                            setNewOption("");
                        }
                    }}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add
                </Button>
            </div>
        </div>
    );
}

export function RadioField({
    label,
    options = [],
    onChange,
    onAddOption,
    onDeleteOption,
    onOptionChange,
}: {
    label: string;
    options: string[];
    onChange: (value: string) => void;
    onAddOption: (option: string) => void;
    onDeleteOption: (idx: number) => void;
    onOptionChange: (idx: number, value: string) => void;
}) {
    const [newOption, setNewOption] = useState("");

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
                    <Input
                        value={option}
                        onChange={(e) => onOptionChange(idx, e.target.value)}
                        className="flex-grow"
                    />
                    <button 
                        type="button" 
                        onClick={() => onDeleteOption(idx)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
            <div className="flex items-center gap-2">
                <Input
                    placeholder="New option"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    className="flex-grow"
                />
                <Button
                    type="button"
                    onClick={() => {
                        if (newOption.trim()) {
                            onAddOption(newOption);
                            setNewOption("");
                        }
                    }}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add
                </Button>
            </div>
        </div>
    );
}
