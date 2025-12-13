
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalItems = await prisma.item.count({
      where: { status: 'PUBLISHED' },
    });

    const totalCollections = await prisma.collection.count();
    const totalCommunities = await prisma.community.count();

    const totalDownloadsResult = await prisma.bitstream.aggregate({
      _sum: {
        downloadCount: true,
      },
    });
    const totalDownloads = totalDownloadsResult._sum.downloadCount || 0;

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const newSubmissionsThisMonth = await prisma.item.count({
      where: {
        status: 'PUBLISHED',
        createdAt: {
          gte: new Date(currentYear, currentMonth - 1, 1), // Start of current month
          lt: new Date(currentYear, currentMonth, 1),     // Start of next month
        },
      },
    });

    return NextResponse.json({
      totalItems,
      totalCollections,
      totalCommunities,
      totalDownloads,
      newSubmissionsThisMonth,
    });
  } catch (error) {
    console.error("Error fetching summary statistics:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
