"use client";

import { useEffect, useState } from "react";
import { fetchProtectedData } from "@/lib/api";

interface ProtectedDataProps {
  token: string;
}

const ProtectedData = ({ token }: ProtectedDataProps) => {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const result = await fetchProtectedData(token);
        setData(result);
      } catch (err: any) {
        console.error("Failed to fetch protected data:", err);
        setError(err.message || "Unknown error occurred.");
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [token]);

  if (loading) return <div>Loading protected data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow text-sm">
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default ProtectedData;
