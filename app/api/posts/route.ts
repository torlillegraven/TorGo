export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;


import { prisma } from "../../../lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { put } from "@vercel/blob";

async function saveFileToLocal(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = file.name.split(".").pop() || "jpg";
  const fname = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `/public/uploads/${fname}`;
  const fsPath = process.cwd() + path;
  const fs = await import("fs/promises");
  await fs.mkdir(process.cwd() + "/public/uploads", { recursive: true });
  await fs.writeFile(fsPath, buffer);
  return `/uploads/${fname}`;
}

async function saveFileToBlob(file: File): Promise<string> {
  const blob = await put(`uploads/${Date.now()}-${file.name}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  return blob.url;
}

export async function GET(req: NextRequest) {
  try {
    const tagId = req.nextUrl.searchParams.get("tagId") || process.env.NEXT_PUBLIC_DEFAULT_TAG_ID || "demo-tag";
    const rows = await prisma.post.findMany({ where: { tagId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const tagId = String(form.get("tagId") || "");
    const title = String(form.get("title") || "");
    const body = String(form.get("body") || "");
    const lat = Number(form.get("lat"));
    const lng = Number(form.get("lng"));
    const image = form.get("image") as File | null;

    if (!tagId || !title || Number.isNaN(lat) || Number.isNaN(lng)) {
      return new Response("Missing fields", { status: 400 });
    }

    await prisma.tag.upsert({ where: { id: tagId }, update: {}, create: { id: tagId, name: tagId } });

    let imageUrl: string | undefined;
    if (image && image.size > 0) {
      imageUrl = process.env.BLOB_READ_WRITE_TOKEN ? await saveFileToBlob(image) : await saveFileToLocal(image);
    }

    const row = await prisma.post.create({ data: { tagId, title, body, lat, lng, imageUrl } });
    return NextResponse.json(row, { status: 201 });
  } catch (e: any) {
    return new Response(e?.message || "Server error", { status: 500 });
  }
}
