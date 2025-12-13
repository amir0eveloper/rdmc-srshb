
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        items: {
          where: { status: 'PUBLISHED' },
          include: {
            bitstreams: {
              select: { downloadCount: true }
            }
          }
        },
      },
    });

    const activeCollections = collections.map(collection => {
      const totalDownloads = collection.items.reduce((sum, item) => {
        const itemDownloads = item.bitstreams.reduce((bitstreamSum, bitstream) => bitstreamSum + (bitstream.downloadCount || 0), 0);
        return sum + itemDownloads;
      }, 0);

      return {
        id: collection.id,
        name: collection.name,
        itemCount: collection.items.length,
        totalDownloads,
      };
    }).sort((a, b) => b.itemCount - a.itemCount || b.totalDownloads - a.totalDownloads); // Sort by item count, then by downloads

    return NextResponse.json(activeCollections.slice(0, 10)); // Return top 10
  } catch (error) {
    console.error("Error fetching most active collections:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
