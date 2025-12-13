'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TopAuthorData {
  name: string;
  count: number;
}

export default function TopAuthorsChart() {
  const [data, setData] = useState<TopAuthorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopAuthors() {
      try {
        const response = await fetch('/api/statistics/top-authors');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: TopAuthorData[] = await response.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch top authors:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchTopAuthors();
  }, []);

  if (loading) {
    return <p>Loading top authors chart...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (data.length === 0) {
    return <p>No top author data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip />
        <Bar dataKey="count" fill="#82ca9d" name="Submissions" />
      </BarChart>
    </ResponsiveContainer>
  );
}
