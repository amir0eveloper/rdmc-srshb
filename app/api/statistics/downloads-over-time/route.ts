
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11); // Go back 11 months to include the current month as one of the 12
    twelveMonthsAgo.setDate(1); // Start from the first day of that month
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const bitstreams = await prisma.bitstream.findMany({
      where: {
        createdAt: {
          gte: twelveMonthsAgo,
        },
      },
      select: {
        createdAt: true,
        downloadCount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const monthlyDownloads = new Map<string, number>(); // Format: YYYY-MM

    for (let i = 0; i < 12; i++) {
        const date = new Date(twelveMonthsAgo);
        date.setMonth(twelveMonthsAgo.getMonth() + i);
        const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        monthlyDownloads.set(yearMonth, 0);
    }

    bitstreams.forEach(bitstream => {
      const yearMonth = `${bitstream.createdAt.getFullYear()}-${(bitstream.createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlyDownloads.set(yearMonth, (monthlyDownloads.get(yearMonth) || 0) + bitstream.downloadCount);
    });

    const formattedData = Array.from(monthlyDownloads.entries()).map(([month, downloads]) => ({
      month,
      downloads,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching downloads over time:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
