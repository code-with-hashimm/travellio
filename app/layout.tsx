import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export const metadata: Metadata = {
  title: "Travel Deal Hunter — AI-Powered Travel Deal Finder",
  description:
    "We scan 500+ platforms in real-time so you never overpay for flights, hotels or experiences again. Built at TinyFish Hackathon 2025."
};

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <SmoothScrollProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
