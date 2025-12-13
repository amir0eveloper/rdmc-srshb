
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const topDownloads = await prisma.bitstream.groupBy({
      by: ['itemId'],
      _sum: {
        downloadCount: true,
      },
      orderBy: {
        _sum: {
          downloadCount: 'desc',
        },
      },
      take: 10,
    });

    const itemsWithTitles = await Promise.all(
      topDownloads.map(async (download) => {
        const item = await prisma.item.findUnique({
          where: { id: download.itemId },
          select: { title: true },
        });
        return {
          title: item?.title || `Item ${download.itemId}`,
          downloads: download._sum.downloadCount || 0,
        };
      })
    );

    return NextResponse.json(itemsWithTitles);
  } catch (error) {
    console.error("Error fetching top downloads:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
