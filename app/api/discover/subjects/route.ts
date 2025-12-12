import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const subjectMetadata = await prisma.metadataField.findMany({
      where: { 
        key: 'dc.subject',
        item: {
            status: 'PUBLISHED'
        }
      },
      select: {
        value: true,
      }
    });

    const subjectFrequency = new Map<string, number>();

    subjectMetadata.forEach(field => {
      const subjects = field.value.split(';').map(subject => subject.trim());
      subjects.forEach(subject => {
        if (subject) { // Ensure not to count empty strings
          const normalizedSubject = subject.toLowerCase();
          subjectFrequency.set(normalizedSubject, (subjectFrequency.get(normalizedSubject) || 0) + 1);
        }
      });
    });

    const sortedSubjects = Array.from(subjectFrequency.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const topSubjects = sortedSubjects.slice(0, 20);

    return NextResponse.json(topSubjects);
  } catch (error) {
    console.error("Error fetching subject facets:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
