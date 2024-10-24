import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import Link from "next/link";

const Faqs1: React.FC = () => {
  const faqs = [
    {
      id: 1,
      question: "What is NexMeet?",
      answer:
        "NexMeet is your go-to platform for organizing college and social events. NexMeet makes it super easy to plan, manage, and enjoy. We're all about bringing people together and making event planning fun and hassle-free!",
    },
    {
      id: 2,
      question: "How do I register for Events?",
      answer:
        "Browse events on the 'Explore Events' tab, click 'Register,' and fill in the details to sign up. Now, all you have to do is show up and have fun!",
    },
    {
      id: 3,
      question: "Where can I view the events I've registered for?",
      answer:
        "Sign in, go to your profile, and view all your registered events under 'Your Events.'",
    },
    {
      id: 4,
      question: "Can I create my own custom events?",
      answer:
        "Yes, go to your profile, click 'Organize Your Own Event,' and fill in the details. You are ready to go!",
    },
    {
      id: 5,
      question: "How do I cancel my event registration?",
      answer:
        "Go to 'Your Events' in Profile, select the event, and click 'Cancel Registration'.",
    },
    {
      id: 6,
      question: "Can I edit the details of my event after it's created?",
      answer:
        "Yes! You can update your event details anytime using 'Manage your Events' in Profile section.",
    },
    {
      id: 7,
      question: "Is there a way to invite my friends to an event?",
      answer:
        "Yes, click the share button on the event page to invite friends via social media or link.",
    },
  ];

  const [activeId, setActiveId] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="py-12 bg-black text-white sm:py-16 lg:py-20 xl:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base font-normal leading-7 lg:text-lg lg:mt-6 lg:leading-8">
            Ask everything you need to know about our products and services.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-12 overflow-hidden border border-white divide-y divide-white sm:mt-16 rounded-xl">
          {faqs.map((faq) => (
            <div key={faq.id} role="region">
              <h3>
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={activeId === faq.id}
                  className="flex items-center justify-between w-full px-6 py-5 text-lg font-semibold text-left sm:p-6"
                >
                  <span>{faq.question}</span>
                  <span className="ml-4">
                    {activeId === faq.id ? (
                      <FaMinus className="w-6 h-6 text-white" />
                    ) : (
                      <FaPlus className="w-6 h-6 text-white" />
                    )}
                  </span>
                </button>
              </h3>
              {activeId === faq.id && (
                <div>
                  <div className="px-6 pb-6">
                    <p className="text-base text-white">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs1;
