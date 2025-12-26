"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MostActiveCollectionData {
  id: string;
  name: string;
  itemCount: number;
  totalDownloads: number;
}

export default function MostActiveCollectionsTable() {
  const [data, setData] = useState<MostActiveCollectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMostActiveCollections() {
      try {
        const response = await fetch("/api/statistics/most-active-collections");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: MostActiveCollectionData[] = await response.json();
        setData(result);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Failed to fetch most active collections:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchMostActiveCollections();
  }, []);

  if (loading) {
    return <p>Loading most active collections table...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (data.length === 0) {
    return <p>No most active collections data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Collection Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Items
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total Downloads
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((collection) => (
            <tr key={collection.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                <Link href={`/collections/${collection.id}`}>
                  {collection.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {collection.itemCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {collection.totalDownloads}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
