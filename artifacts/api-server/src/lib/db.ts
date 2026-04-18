import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env["UPSTASH_REDIS_REST_URL"] ?? "",
  token: process.env["UPSTASH_REDIS_REST_TOKEN"] ?? "",
});

type DbResult<T> = { ok: true; value: T } | { ok: false; value: null };

export const db = {
  async get(key: string): Promise<DbResult<string | null>> {
    try {
      const value = await redis.get<string>(key);
      return { ok: true, value: value ?? null };
    } catch {
      return { ok: false, value: null };
    }
  },

  async set(key: string, value: string): Promise<{ ok: boolean }> {
    try {
      await redis.set(key, value);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  },

  async delete(key: string): Promise<{ ok: boolean }> {
    try {
      await redis.del(key);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  },

  async list(prefix?: string): Promise<DbResult<string[]>> {
    try {
      const pattern = prefix ? `${prefix}*` : "*";
      const keys = await redis.keys(pattern);
      return { ok: true, value: keys };
    } catch {
      return { ok: false, value: null };
    }
  },
};
