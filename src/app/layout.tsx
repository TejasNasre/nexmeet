import type { Metadata } from "next";
import { DM_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm_mono",
});

export const metadata: Metadata = {
  title: "NexMeet",
  description: "Make Your Events Memorable With NexMeet",
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`), // Base Url
  openGraph: {
    title: "NexMeet - Make Your Events Memorable",
    description:
      "Join events, connect with people, and make memories with NexMeet.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={mono.className}>

          <Header />
          <main>{children}</main>
          <Footer />
        

      </body>
    </html>
  );
}
