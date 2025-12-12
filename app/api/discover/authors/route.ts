import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authorMetadata = await prisma.metadataField.findMany({
      where: { 
        key: 'dc.contributor.author',
        item: {
            status: 'PUBLISHED'
        }
      },
      select: {
        value: true,
      }
    });

    const authorFrequency = new Map<string, number>();

    authorMetadata.forEach(field => {
      const authors = field.value.split(';').map(author => author.trim());
      authors.forEach(author => {
        if (author) { // Ensure not to count empty strings
          const normalizedAuthor = author.toLowerCase();
          authorFrequency.set(normalizedAuthor, (authorFrequency.get(normalizedAuthor) || 0) + 1);
        }
      });
    });

    const sortedAuthors = Array.from(authorFrequency.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const topAuthors = sortedAuthors.slice(0, 20);

    return NextResponse.json(topAuthors);
  } catch (error) {
    console.error("Error fetching author facets:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
