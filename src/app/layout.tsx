import React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DM_Mono } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/components/Scroll-to-top";
import ClientServiceWorker from "./ClientServiceWorker";

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm_mono",
});

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://nexmeet-lake.vercel.app";

export const metadata: Metadata = {
  title: "NexMeet",
  description: "Make Your Events Memorable With NexMeet",
  metadataBase: new URL(baseUrl),
  keywords: "events, NexMeet, memorable events, networking, event management",
  openGraph: {
    title: "NexMeet - Make Your Events Memorable",
    description:
      "Join events, connect with people, and make memories with NexMeet.",
    url: baseUrl,
    images: [
      {
        url: "https://jzhgfowuznosxtwzkbkx.supabase.co/storage/v1/object/public/event_image/_Black_And_Yellow_Modern_Event_Producer_Initial_Logo-removebg-preview.png",
        width: 800,
        height: 600,
        alt: "NexMeet Event",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexMeet",
    description: "Make Your Events Memorable With NexMeet",
    images: [
      "https://jzhgfowuznosxtwzkbkx.supabase.co/storage/v1/object/public/event_image/_Black_And_Yellow_Modern_Event_Producer_Initial_Logo-removebg-preview.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta
          name="description"
          content="Make Your Events Memorable With NexMeet"
        />
        <meta
          name="keywords"
          content="events, NexMeet, memorable events, networking, event management"
        />
        <meta
          property="og:title"
          content="NexMeet - Make Your Events Memorable"
        />
        <meta
          property="og:description"
          content="Join events, connect with people, and make memories with NexMeet."
        />
        <meta property="og:url" content={baseUrl} />
        <meta
          property="og:image"
          content="https://jzhgfowuznosxtwzkbkx.supabase.co/storage/v1/object/public/event_image/_Black_And_Yellow_Modern_Event_Producer_Initial_Logo-removebg-preview.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NexMeet" />
        <meta
          name="twitter:description"
          content="Make Your Events Memorable With NexMeet"
        />
        <meta
          name="twitter:image"
          content="https://jzhgfowuznosxtwzkbkx.supabase.co/storage/v1/object/public/event_image/_Black_And_Yellow_Modern_Event_Producer_Initial_Logo-removebg-preview.png"
        />
        <title>NexMeet</title>
      </head>
      <body suppressHydrationWarning={true} className={spaceGrotesk.className}>
        <Analytics />
        <SpeedInsights />
        <Toaster
          theme="dark"
          richColors
          toastOptions={{
            unstyled: true,
            style: {
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              borderRadius: ".5rem",
              backdropFilter: "blur(5px)",
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              border: ".125rem solid #8888",
            },
            classNames: {
              toast:
                "text-sm group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg px-4 py-3 w-full z-10",
              description: "group-[.toast]:text-muted-foreground",
              actionButton: "bg-zinc-400",
              cancelButton: "bg-orange-400",
              closeButton: "bg-lime-400",
            },
          }}
        />
        <ClientServiceWorker />
        <Header />
        <ScrollToTop />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
