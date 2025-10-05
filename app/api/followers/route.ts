
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, email } = await req.json();
    if (!code || !email) return new Response("Missing code or email", { status: 400 });

    const invite = await prisma.invite.findUnique({ where: { code } });
    if (!invite) return new Response("Invalid invite code", { status: 404 });

    const follower = await prisma.follower.create({ data: { inviteId: invite.id, email } });
    return NextResponse.json({ ok: true, id: follower.id });
  } catch (e: any) {
    return new Response(e?.message || "Server error", { status: 500 });
  }
}
