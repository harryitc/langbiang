import { NextResponse } from "next/server";
import { getNewsById } from "@/lib/site";
import { likeKey, redis } from "@/lib/redis";

// Luôn chạy động (không cache) để số like phản ánh thời gian thực.
export const dynamic = "force-dynamic";

// GET /api/likes/[id] — trả về số lượt thích hiện tại của bài viết.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getNewsById(id)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const likes = (await redis.get<number>(likeKey(id))) ?? 0;
  return NextResponse.json({ likes });
}

// POST /api/likes/[id] — tăng 1 lượt thích và trả về số mới.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getNewsById(id)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const likes = await redis.incr(likeKey(id));
  return NextResponse.json({ likes });
}

// DELETE /api/likes/[id] — bỏ 1 lượt thích (không cho xuống dưới 0).
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getNewsById(id)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  let likes = await redis.decr(likeKey(id));
  if (likes < 0) {
    likes = 0;
    await redis.set(likeKey(id), 0);
  }
  return NextResponse.json({ likes });
}
