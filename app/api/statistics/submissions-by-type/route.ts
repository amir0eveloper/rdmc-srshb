
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const typeMetadata = await prisma.metadataField.findMany({
      where: {
        key: 'dc.type',
        item: {
          status: 'PUBLISHED',
        },
      },
      select: {
        value: true,
      },
    });

    const typeFrequency = new Map<string, number>();

    typeMetadata.forEach((field) => {
      // Split by semicolon and trim each type, then count
      const types = field.value.split(';').map((type) => type.trim());
      types.forEach((type) => {
        if (type) {
          const normalizedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(); // Capitalize first letter
          typeFrequency.set(normalizedType, (typeFrequency.get(normalizedType) || 0) + 1);
        }
      });
    });

    const sortedTypes = Array.from(typeFrequency.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(sortedTypes);
  } catch (error) {
    console.error("Error fetching submissions by type:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
