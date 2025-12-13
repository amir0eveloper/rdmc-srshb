'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TopDownloadData {
  title: string;
  downloads: number;
}

export default function TopDownloadsChart() {
  const [data, setData] = useState<TopDownloadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopDownloads() {
      try {
        const response = await fetch('/api/statistics/top-downloads');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: TopDownloadData[] = await response.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch top downloads:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchTopDownloads();
  }, []);

  if (loading) {
    return <p>Loading top downloads chart...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (data.length === 0) {
    return <p>No top download data available.</p>;
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
        <YAxis dataKey="title" type="category" width={100} />
        <Tooltip />
        <Bar dataKey="downloads" fill="#8884d8" name="Downloads" />
      </BarChart>
    </ResponsiveContainer>
  );
}
