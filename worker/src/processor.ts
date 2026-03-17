import { Pool } from "pg";
import { WorkerConfig } from "./config";

/**
 * Stub: fetch a batch of pending items from the database.
 * Replace with real query logic when implementing processing.
 */
export async function fetchPendingBatch(
  pool: Pool,
  batchSize: number
): Promise<{ id: number; externalId: string }[]> {
  const result = await pool.query<{ id: number; external_id: string }>(
    `SELECT id, external_id FROM run_items
     WHERE status = 'pending'
     ORDER BY created_at ASC
     LIMIT $1`,
    [batchSize]
  );
  return result.rows.map((r) => ({ id: r.id, externalId: r.external_id }));
}

/**
 * Stub: process a single item against the mock API.
 * Replace with real HTTP call + idempotency logic.
 */
export async function processItem(
  item: { id: number; externalId: string },
  config: WorkerConfig
): Promise<void> {
  // TODO: call config.mockApiUrl with idempotency key, apply retry/back-off
  console.log(
    `[worker] (stub) Processing item id=${item.id} externalId=${item.externalId} via ${config.mockApiUrl}`
  );
}
