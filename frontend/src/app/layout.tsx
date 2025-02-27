import React, { useState, useEffect } from "react"; // Server components can import React without "use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";

// Dynamically import client components (Navbar and ThemeToggle) so they work in a server component.
const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Game Groove",
  description: "Find your next board game!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If you need to handle client-specific logic (like mounting for theme), you can move that
  // logic into a separate ClientWrapper component.
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}