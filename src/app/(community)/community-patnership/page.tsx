"use client";

import React, { useState } from "react";
import { supabase } from "../../../utils/supabase";
import { Space_Grotesk } from "next/font/google";
import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxDescriptionLength = 200;

function CommunityPartners() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [communitySize, setCommunitySize] = useState<string>("");
  const [description, setDescription] = useState("");
  const [quality, setQuality] = useState("");
  const [belief, setBelief] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [emailStatus, setEmailStatus] = useState(false); // Track email validation status

  const qualityOptions = [
    {
      id: "established",
      label: "Established Community",
      description:
        "Active community with regular events and 2+ years of engagement",
    },
    {
      id: "growing",
      label: "Growing Network",
      description: "Rapidly expanding community with consistent monthly growth",
    },
    {
      id: "specialized",
      label: "Specialized Focus",
      description: "Niche community with deeply engaged members",
    },
  ];

  const beliefOptions = [
    {
      id: "innovation",
      label: "Innovation First",
      description:
        "We focus on pushing boundaries and embracing new technologies",
    },
    {
      id: "community",
      label: "Community-Driven",
      description: "We prioritize community feedback and collective growth",
    },
    {
      id: "impact",
      label: "Impact Focused",
      description: "We're dedicated to creating meaningful industry change",
    },
  ];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    setStep(1);
  };

  const validateStep1 = () => {
    if (
      !name ||
      !email ||
      !phone ||
      !communityName ||
      !communitySize ||
      !description
    ) {
      toast.error("Please fill in all fields before proceeding");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!quality || !belief) {
      toast.error("Please select both a quality and belief option");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
      return;
    }

    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("community_partners").insert([
        {
          name,
          email,
          phone,
          community_name: communityName,
          community_size: communitySize,
          Desc: description,
          qualities: quality,
          believe: belief,
        },
      ]);

      if (error) throw error;

      // Send email notification
      await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "form-submission",
          name,
          email,
          message: `Community Name: ${communityName}\nCommunity Size: ${communitySize}\nDescription: ${description}\nQuality: ${quality}\nBelief: ${belief}`,
        }),
      });

      toast.success("Successfully submitted your partnership application!");
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setCommunityName("");
      setEmailStatus(false);
      setCommunitySize("0");
      setDescription("");
      setQuality("");
      setBelief("");
      setStep(1);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkEmailExists = async () => {
    if (!emailRegex.test(email.trim())) {
      setEmailStatus(false);
      toast.error("Invalid Email.");
      return;
    }

    if (email.trim() === "") {
      setEmailStatus(false); // No status if the email is empty
      return;
    }

    try {
      const { data } = await supabase
        .from("community_partners")
        .select("email")
        .eq("email", email);

      if (data && data.length > 0) {
        setEmailStatus(false);
        toast.error("Email already exists. Please use a different email.");
      } else {
        setEmailStatus(true);
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  return (
    <div
      className={`${spaceGrotesk.className} w-full min-h-screen bg-black text-white py-[8rem] px-4`}
    >
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Community Partners
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join our ecosystem of innovative communities. Together, we build the
            future.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8">
          <div className="flex justify-between mb-8">
            <div className="flex gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border 
                  ${step >= 1 ? "border-white bg-white text-black" : "border-white/30"}`}
              >
                1
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border 
                  ${step >= 2 ? "border-white bg-white text-black" : "border-white/30"}`}
              >
                2
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30"
                  />
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={checkEmailExists}
                      placeholder="Your Email"
                      required
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30"
                    />
                    {emailStatus !== null && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {emailStatus ? "✅" : "❌"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const phoneValue = e.target.value;
                      if (/^\d*$/.test(phoneValue)) {
                        // Allow only numeric characters
                        setPhone(phoneValue);
                      }
                    }}
                    placeholder="Your Phone"
                    required
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30"
                  />
                  <input
                    type="number"
                    value={communitySize}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (value >= 0) {
                        setCommunitySize(value.toString());
                      }
                    }}
                    placeholder="Community Size"
                    required
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30"
                  />
                </div>

                <input
                  type="text"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  placeholder="Community Name"
                  required
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30"
                />
                <textarea
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= maxDescriptionLength) {
                      setDescription(e.target.value);
                    }
                  }}
                  placeholder="Tell us about your community..."
                  required
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30 h-32"
                />
                <p className="text-sm text-gray-400">
                  {description.length}/{maxDescriptionLength} characters
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">
                    What best describes your community?
                  </h3>
                  {qualityOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`block p-4 border ${
                        quality === option.id
                          ? "border-white"
                          : "border-white/10"
                      } rounded-xl hover:bg-white/5 cursor-pointer transition-colors`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="quality"
                          value={option.id}
                          checked={quality === option.id}
                          onChange={(e) => setQuality(e.target.value)}
                          className="mt-1.5 mr-4"
                        />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-400">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">
                    What drives your community forward?
                  </h3>
                  {beliefOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`block p-4 border ${
                        belief === option.id
                          ? "border-white"
                          : "border-white/10"
                      } rounded-xl hover:bg-white/5 cursor-pointer transition-colors`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="belief"
                          value={option.id}
                          checked={belief === option.id}
                          onChange={(e) => setBelief(e.target.value)}
                          className="mt-1.5 mr-4"
                        />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-400">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-white/10">
              {step === 2 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-2 text-white/80 hover:text-white"
                >
                  Back
                </button>
              )}

              {step === 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto px-6 py-3 bg-white text-black rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <Mail size={20} />
            <span>contact@nexmeet.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={20} />
            <span>+1 (123) 456-7890</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPartners;
