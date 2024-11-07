"use client";

import React, { useState } from "react";
import { supabase } from "../../utils/supabase";
import { Space_Grotesk } from "next/font/google";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (message.length < 5) {
      toast.error("Message must be at least 5 characters long.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert([{ name, email, message }]);

      if (error) throw error;

      toast.success("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error sending message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`${spaceGrotesk.className} w-full min-h-screen bg-black text-white py-[8rem] px-[2rem] flex flex-col justify-start items-center gap-24 relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-12 text-center tracking-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Contact Us
        </motion.h1>

        <div className="max-w-4xl mx-auto">
          <motion.p
            className="text-xl mb-12 text-center leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Have questions or feedback? We&apos;d love to hear from you. Reach
            out to us using the form below or through our contact information.
          </motion.p>

          <div className="w-full flex flex-col md:flex-row gap-12">
            <motion.form
              onSubmit={handleSubmit}
              className="w-full md:w-1/2 space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full p-3 border dark:border-white border-black bg-white bg-opacity-5 rounded-xl text-white placeholder-gray-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
                className="w-full p-3 border dark:border-white border-black bg-white bg-opacity-5 rounded-xl text-white placeholder-gray-400"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
                required
                className="w-full p-3 border dark:border-white border-black bg-white bg-opacity-5 rounded-xl text-white placeholder-gray-400 h-32"
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </motion.form>

            <motion.div
              className="w-full md:w-1/2 space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center space-x-4">
                <Mail size={24} className="text-gray-400" />
                <p className="text-xl">nexmeetup@gmail.com</p>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin size={24} className="text-gray-400" />
                <p className="text-xl">Nagpur,Maharashtra</p>
              </div>
              <div className="h-64 md:h-auto mt-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d238129.6392486545!2d78.90769466099978!3d21.16132625804449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1730995893207!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: "0.75rem" }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
