"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SubmissionTypeData {
  name: string;
  count: number;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#d0ed57",
  "#a4de6c",
  "#00C49F",
];

export default function SubmissionsByTypeChart() {
  const [data, setData] = useState<SubmissionTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmissionsByType() {
      try {
        const response = await fetch("/api/statistics/submissions-by-type");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: SubmissionTypeData[] = await response.json();
        setData(result);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch submissions by type:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissionsByType();
  }, []);

  if (loading) {
    return <p>Loading submissions by type chart...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (data.length === 0) {
    return <p>No submission type data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="count"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
