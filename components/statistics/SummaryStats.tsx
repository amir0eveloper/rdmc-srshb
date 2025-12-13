'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface SummaryStatsData {
  totalItems: number;
  totalCollections: number;
  totalCommunities: number;
  totalDownloads: number;
  newSubmissionsThisMonth: number;
}

export default function SummaryStats() {
  const [stats, setStats] = useState<SummaryStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummaryStats() {
      try {
        const response = await fetch('/api/statistics/summary');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: SummaryStatsData = await response.json();
        setStats(data);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch summary stats:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchSummaryStats();
  }, []);

  if (loading) {
    return (
      <>
        <Card>
          <CardHeader><CardTitle>Total Items</CardTitle></CardHeader>
          <CardContent><p>Loading...</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Collections</CardTitle></CardHeader>
          <CardContent><p>Loading...</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Communities</CardTitle></CardHeader>
          <CardContent><p>Loading...</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Downloads</CardTitle></CardHeader>
          <CardContent><p>Loading...</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>New Submissions (This Month)</CardTitle></CardHeader>
          <CardContent><p>Loading...</p></CardContent>
        </Card>
      </>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!stats) {
    return <p>No summary statistics available.</p>;
  }

  return (
    <>
      <Card>
        <CardHeader><CardTitle>Total Items</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{stats.totalItems}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Total Collections</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{stats.totalCollections}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Total Communities</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{stats.totalCommunities}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Total Downloads</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{stats.totalDownloads}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>New Submissions (This Month)</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{stats.newSubmissionsThisMonth}</p></CardContent>
      </Card>
    </>
  );
}
