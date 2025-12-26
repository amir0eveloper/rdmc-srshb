import { Search, Database, ArrowRight, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import RecentSubmissionCard from "@/components/RecentSubmissionCard";
import DiscoverSidebar from "@/components/DiscoverSidebar";

interface CollectionWithCount {
  _count: { items: number };
}

interface Community {
  id: string;
  name: string;
  description: string | null;
  collections: CollectionWithCount[];
}

const CommunityCard = ({ community }: { community: Community }) => {
  const totalItems = community.collections.reduce(
    (acc: number, collection: CollectionWithCount) =>
      acc + collection._count.items,
    0
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{community.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {community.description}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <Database className="w-4 h-4 mr-1" />
            <span>{totalItems} datasets</span>
          </div>
        </div>
        <Link
          href={`/communities/${community.id}`}
          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default async function Home() {
  const communities = await prisma.community.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      collections: {
        include: {
          _count: {
            select: { items: true },
          },
        },
      },
    },
  });

  const rawRecentItems = await prisma.item.findMany({
    take: 4,
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: {
      submitter: true,
      collection: true,
      metadata: {
        where: { key: "dc.description.abstract" },
      },
    },
  });

  const recentItems = rawRecentItems.map((item) => {
    const abstract =
      item.metadata.find((m) => m.key === "dc.description.abstract")?.value ||
      "";
    return {
      ...item,
      abstract,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-800 to-blue-400">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-18 md:py-10">
          <div className="max-w-5xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-8 border border-white/30">
              <Globe className="w-4 h-4 mr-2" />
              Somali Regional State Health Bureau Repository
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
              Welcome to the Somali Regional State Health Bureau Repository
            </h1>
            <p className=" text-blue-100 mb-8 max-w-2xl">
              At the heart of advancing research and management at Somali
              Regional State Health Bureau, the Repository is dedicated to
              improving outcomes through the efficient collection and
              dissemination of knowledge.
            </p>
            {/* Search Section in Hero */}
            <div className="">
              <form action="/search" method="GET" className="relative max-w-xl">
                <div className="relative border border-gray-300 rounded-xl shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search the repository..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-blue-700 px-6 py-2 rounded-lg hover:bg-blue-800 hover:text-white transition-colors"
                >
                  <span className="flex items-center">
                    <Search size={20} className="mr-2" />
                    Search
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-20">
            {/* Recent Submissions */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Recent Submissions
                  </h2>
                  <p className="text-gray-600">
                    Latest research contributions from our community
                  </p>
                </div>
                <Link
                  href="/items"
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
                >
                  View all submissions
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentItems.map((item) => (
                  <RecentSubmissionCard key={item.id} item={item} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Load more ...
                </button>
              </div>
            </section>

            {/* Communities Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Communities
                  </h2>
                  <p className="text-gray-600">
                    Browse the communities in the repository.
                  </p>
                </div>
                <Link
                  href="/communities"
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
                >
                  View all communities
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DiscoverSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
