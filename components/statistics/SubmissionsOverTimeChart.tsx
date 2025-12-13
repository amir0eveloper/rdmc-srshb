'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SubmissionOverTimeData {
  month: string; // YYYY-MM
  count: number;
}

export default function SubmissionsOverTimeChart() {
  const [data, setData] = useState<SubmissionOverTimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmissionsOverTime() {
      try {
        const response = await fetch('/api/statistics/submissions-over-time');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: SubmissionOverTimeData[] = await response.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch submissions over time:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissionsOverTime();
  }, []);

  if (loading) {
    return <p>Loading submissions over time chart...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (data.length === 0) {
    return <p>No submissions over time data available.</p>;
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
        <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
