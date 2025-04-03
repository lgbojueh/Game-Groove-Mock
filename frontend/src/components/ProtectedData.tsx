// src/components/ProtectedData.tsx
import { useEffect, useState } from 'react';
import { fetchProtectedData } from '@/lib/api';

interface ProtectedDataProps {
  token: string;
}

const ProtectedData = ({ token }: ProtectedDataProps) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const result = await fetchProtectedData(token);
        setData(result);
      } catch (err: any) {
        setError(err.message);
      }
    }
    getData();
  }, [token]);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
};

export default ProtectedData;
