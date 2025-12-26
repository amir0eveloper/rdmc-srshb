import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import { Session } from "next-auth";

async function authorizeSubmitterOrAdmin(
  session: Session | null,
  itemId: string
) {
  if (!session || !session.user || !session.user.id) {
    return { authorized: false, error: "Unauthorized" };
  }

  if (session.user.role === "ADMIN") {
    return { authorized: true };
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { submitterId: true },
  });

  if (!item || item.submitterId !== session.user.id) {
    return { authorized: false, error: "Forbidden" };
  }

  return { authorized: true };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await auth();
  const { authorized, error } = await authorizeSubmitterOrAdmin(
    session,
    (
      await params
    ).itemId
  );

  if (!authorized) {
    return NextResponse.json(
      { error },
      { status: error === "Unauthorized" ? 401 : 403 }
    );
  }

  try {
    const metadata = await prisma.metadataField.findMany({
      where: { itemId: (await params).itemId },
    });

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await auth();
  const { authorized, error } = await authorizeSubmitterOrAdmin(
    session,
    (
      await params
    ).itemId
  );

  if (!authorized) {
    return NextResponse.json(
      { error },
      { status: error === "Unauthorized" ? 401 : 403 }
    );
  }

  const { key, value } = await req.json();

  if (!key || !value) {
    return NextResponse.json(
      { error: "Key and value are required" },
      { status: 400 }
    );
  }

  try {
    const newMetadata = await prisma.metadataField.create({
      data: {
        itemId: (await params).itemId,
        key,
        value,
      },
    });

    return NextResponse.json(newMetadata, { status: 201 });
  } catch (error) {
    console.error("Error creating metadata:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
