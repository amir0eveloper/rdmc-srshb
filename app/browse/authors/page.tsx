"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";

interface BrowseItem {
  name: string;
  count: number;
}

import { Suspense } from "react";

function BrowseAuthorsContent() {
  const [data, setData] = useState<{
    items: BrowseItem[];
    totalPages: number;
    currentPage: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/browse/authors?page=${page}`);
        if (!response.ok) {
          throw new Error("Failed to fetch authors.");
        }
        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data && (
        <>
          <ul className="space-y-2">
            {data.items.map((item) => (
              <li key={item.name}>
                <Link
                  href={`/search?facet=author&query=${encodeURIComponent(
                    item.name
                  )}`}
                  className="flex justify-between items-center p-3 rounded-md hover:bg-gray-100 text-lg group"
                >
                  <span className="text-blue-600 group-hover:underline capitalize">
                    {item.name}
                  </span>
                  <span className="px-2.5 py-1 text-sm rounded-full bg-gray-200 text-gray-700">
                    {item.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Pagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              baseUrl="/browse/authors"
            />
          </div>
        </>
      )}
    </>
  );
}

export default function BrowseAuthorsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Browse by Author</h1>
      <Suspense fallback={<p>Loading search parameters...</p>}>
        <BrowseAuthorsContent />
      </Suspense>
    </div>
  );
}
