
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11); // Go back 11 months to include the current month as one of the 12
    twelveMonthsAgo.setDate(1); // Start from the first day of that month
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const submissions = await prisma.item.findMany({
      where: {
        status: 'PUBLISHED',
        createdAt: {
          gte: twelveMonthsAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const monthlyCounts = new Map<string, number>(); // Format: YYYY-MM

    for (let i = 0; i < 12; i++) {
        const date = new Date(twelveMonthsAgo);
        date.setMonth(twelveMonthsAgo.getMonth() + i);
        const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        monthlyCounts.set(yearMonth, 0);
    }

    submissions.forEach(submission => {
      const yearMonth = `${submission.createdAt.getFullYear()}-${(submission.createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlyCounts.set(yearMonth, (monthlyCounts.get(yearMonth) || 0) + 1);
    });

    const formattedData = Array.from(monthlyCounts.entries()).map(([month, count]) => ({
      month,
      count,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching submissions over time:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
