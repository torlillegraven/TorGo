
import { prisma } from "../../../lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tagId = req.nextUrl.searchParams.get("tagId") || process.env.NEXT_PUBLIC_DEFAULT_TAG_ID || "demo-tag";
    const rows = await prisma.location.findMany({
      where: { tagId },
      orderBy: { timestamp: "asc" },
      select: { lat: true, lng: true, timestamp: true },
    });
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
