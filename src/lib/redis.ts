import { Redis } from "@upstash/redis";

// Client Upstash Redis dùng chung cho các API route (đọc biến môi trường
// UPSTASH_REDIS_REST_URL và UPSTASH_REDIS_REST_TOKEN).
export const redis = Redis.fromEnv();

/** Khoá lưu số lượt thích của 1 bài viết. */
export const likeKey = (id: string) => `news:like:${id}`;
