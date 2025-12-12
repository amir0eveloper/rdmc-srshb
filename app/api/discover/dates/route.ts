import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    // This raw SQL query is necessary to extract the YEAR from the date string
    // and group by it, which is not directly supported by Prisma's standard groupBy.
    const years: { year: number, count: number }[] = await prisma.$queryRaw(
      Prisma.sql`
        SELECT
          EXTRACT(YEAR FROM TO_DATE(value, 'YYYY-MM-DD')) AS year,
          COUNT(*)::int
        FROM "MetadataField"
        WHERE
          key = 'dc.date.issued'
          AND value ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' -- Ensure value is in the correct format
          AND "itemId" IN (SELECT id FROM "Item" WHERE status = 'PUBLISHED')
        GROUP BY
          year
        ORDER BY
          year DESC
        LIMIT 20;
      `
    );

    // Prisma's $queryRaw with BigInt might return counts as BigInts, so we convert to strings.
    // We also filter out any null years that might result from invalid date formats.
    const formattedYears = years
        .filter(y => y.year !== null)
        .map(y => ({
            name: y.year.toString(),
            count: y.count
        }));

    return NextResponse.json(formattedYears);
  } catch (error) {
    console.error("Error fetching date facets:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
