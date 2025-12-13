'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DownloadOverTimeData {
  month: string; // YYYY-MM
  downloads: number;
}

export default function DownloadsOverTimeChart() {
  const [data, setData] = useState<DownloadOverTimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDownloadsOverTime() {
      try {
        const response = await fetch('/api/statistics/downloads-over-time');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: DownloadOverTimeData[] = await response.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch downloads over time:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchDownloadsOverTime();
  }, []);

  if (loading) {
    return <p>Loading downloads over time chart...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (data.length === 0) {
    return <p>No downloads over time data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="downloads" stroke="#82ca9d" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
