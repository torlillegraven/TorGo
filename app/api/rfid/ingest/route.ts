export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;


import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { tagId, lat, lng, timestamp } = data || {};
    if (!tagId || typeof lat !== "number" || typeof lng !== "number") {
      return new Response("Missing tagId/lat/lng", { status: 400 });
    }

    await prisma.tag.upsert({ where: { id: tagId }, update: {}, create: { id: tagId, name: tagId } });

    await prisma.location.create({
      data: { tagId, lat, lng, timestamp: timestamp ? new Date(timestamp) : new Date() }
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(e?.message || "Server error", { status: 500 });
  }
}
