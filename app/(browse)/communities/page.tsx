
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function CommunitiesPage() {
  const communities = await prisma.community.findMany({
    where: {
      parentId: null, // Only fetch top-level communities
    },
    include: {
      _count: {
        select: {
          subCommunities: true,
          collections: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">All Communities</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <Link href={`/communities/${community.id}`} key={community.id}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-blue-600">{community.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3 mb-4">
                  {community.description || 'No description available.'}
                </p>
                <div className="text-sm font-semibold">
                  <p>{community._count.subCommunities} sub-communities</p>
                  <p>{community._count.collections} collections</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {communities.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No communities found.</p>
      )}
    </div>
  );
}
