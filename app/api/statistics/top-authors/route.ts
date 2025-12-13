
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authorMetadata = await prisma.metadataField.findMany({
      where: {
        key: 'dc.contributor.author',
        item: {
          status: 'PUBLISHED',
        },
      },
      select: {
        value: true,
      },
    });

    const authorFrequency = new Map<string, number>();

    authorMetadata.forEach((field) => {
      const authors = field.value.split(';').map((author) => author.trim());
      authors.forEach((author) => {
        if (author) {
          const normalizedAuthor = author.toLowerCase();
          authorFrequency.set(normalizedAuthor, (authorFrequency.get(normalizedAuthor) || 0) + 1);
        }
      });
    });

    const sortedAuthors = Array.from(authorFrequency.entries())
      .map(([name, count]) => ({ name: name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), count })) // Capitalize for display
      .sort((a, b) => b.count - a.count);

    const topAuthors = sortedAuthors.slice(0, 10);

    return NextResponse.json(topAuthors);
  } catch (error) {
    console.error("Error fetching top authors:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
