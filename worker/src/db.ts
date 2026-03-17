import { Pool } from "pg";

let pool: Pool | null = null;

export function createPool(dbUrl: string): Pool {
  pool = new Pool({ connectionString: dbUrl });

  pool.on("error", (err) => {
    console.error("[db] Unexpected pool error:", err.message);
  });

  return pool;
}

export async function connectWithRetry(
  dbUrl: string,
  maxAttempts = 10,
  delayMs = 2000
): Promise<Pool> {
  let attempt = 0;
  while (attempt < maxAttempts) {
    attempt++;
    try {
      const p = createPool(dbUrl);
      const client = await p.connect();
      client.release();
      console.log("[db] Connected to Postgres");
      return p;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[db] Connection attempt ${attempt}/${maxAttempts} failed: ${message}`);
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw new Error("[db] Could not connect to Postgres after max attempts");
}
