// src/components/Providers.tsx
"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar"; // ✅ use correct filename and export

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <SessionProvider>
        <Navbar />
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
