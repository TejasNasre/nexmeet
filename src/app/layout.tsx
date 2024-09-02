import type { Metadata } from "next";
import { DM_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm_mono",
});

export const metadata: Metadata = {
  title: "NexMeet",
  description: "Make Your Events Memorable With NexMeet",
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
      </body>
    </html>
  );
}
