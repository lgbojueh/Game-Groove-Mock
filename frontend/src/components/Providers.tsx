// src/components/Providers.tsx
"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import ClientNavbar from "./ClientNavbar";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <SessionProvider>
        <ClientNavbar />
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
