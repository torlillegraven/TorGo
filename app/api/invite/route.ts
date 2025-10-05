export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;


import { prisma } from "../../../lib/prisma";
import { NextResponse, NextRequest } from "next/server";

function makeCode() {
  return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 4);
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });
  const invite = await prisma.invite.findUnique({ where: { code } });
  if (!invite) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ tagId: invite.tagId, code: invite.code });
}

export async function POST(req: Request) {
  try {
    const { tagId } = await req.json();
    if (!tagId) return new Response("Missing tagId", { status: 400 });

    await prisma.tag.upsert({ where: { id: tagId }, update: {}, create: { id: tagId, name: tagId } });

    const existing = await prisma.invite.findFirst({ where: { tagId } });
    if (existing) return NextResponse.json({ code: existing.code });

    const code = makeCode();
    const invite = await prisma.invite.create({ data: { tagId, code } });
    return NextResponse.json({ code: invite.code });
  } catch (e: any) {
    return new Response(e?.message || "Server error", { status: 500 });
  }
}
