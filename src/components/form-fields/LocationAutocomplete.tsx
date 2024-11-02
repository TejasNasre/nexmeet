import React from 'react';
import Autocomplete from "react-google-autocomplete";

interface Props {
    onSelect: (e: string) => void;
    placeholder?: string;
}

const LocationAutocomplete: React.FC<Props> = ({ onSelect, placeholder }) => (
  <Autocomplete
    placeholder={placeholder ?? "Enter Event Location"}
    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
    options={{
      types: ["establishment"],
      componentRestrictions: { country: "in" }, // Adjust country as needed
    }}
    onPlaceSelected={({ formatted_address }) => onSelect(formatted_address ?? "")}
    className="w-full p-2 text-white bg-black border border-white rounded-md"
  />
);

export default LocationAutocomplete;
