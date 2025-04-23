"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { fetchProtectedData } from "@/lib/api";

interface ProtectedDataProps {
  token: string;
}

const ProtectedData = ({ token }: ProtectedDataProps) => {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const result = await fetchProtectedData(token);
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    }
    getData();
  }, [token]);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
};

export default ProtectedData;
