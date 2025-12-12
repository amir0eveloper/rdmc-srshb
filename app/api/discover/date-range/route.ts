import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from '@prisma/client';

interface DateRangeResult {
    min_year: number;
    max_year: number;
}

export async function GET() {
  try {
    // This raw SQL query is necessary to extract the YEAR from date strings
    // that may not be in perfect YYYY-MM-DD format.
    const result: DateRangeResult[] = await prisma.$queryRaw(
      Prisma.sql`
        SELECT
          MIN(CAST(SUBSTRING(value FROM '^[0-9]{4}') AS INTEGER)) AS min_year,
          MAX(CAST(SUBSTRING(value FROM '^[0-9]{4}') AS INTEGER)) AS max_year
        FROM "MetadataField"
        WHERE
          key = 'dc.date.issued'
          AND value ~ '^[0-9]{4}' -- Ensures the value starts with a 4-digit year
          AND "itemId" IN (SELECT id FROM "Item" WHERE status = 'PUBLISHED');
      `
    );
    
    const range = {
        min: result[0]?.min_year || new Date().getFullYear() - 10,
        max: result[0]?.max_year || new Date().getFullYear(),
    }

    return NextResponse.json(range);
  } catch (error) {
    console.error("Error fetching date range:", error);
    // Provide a sensible default if the query fails
    const currentYear = new Date().getFullYear();
    return NextResponse.json({ 
        min: currentYear - 10,
        max: currentYear 
    }, { status: 500 });
  }
}
