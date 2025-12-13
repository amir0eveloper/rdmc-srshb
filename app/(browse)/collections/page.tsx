
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: {
      community: {
        select: { name: true },
      },
      _count: {
        select: { items: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">All Collections</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link href={`/collections/${collection.id}`} key={collection.id}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-blue-600">{collection.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm mb-2">
                  In community: {collection.community.name}
                </p>
                <p className="text-gray-700 line-clamp-3 mb-4">
                  {collection.description || 'No description available.'}
                </p>
                <p className="text-sm font-semibold">
                  {collection._count.items} item(s)
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {collections.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No collections found.</p>
      )}
    </div>
  );
}
