import { loadConfig } from "./config";
import { connectWithRetry } from "./db";
import { fetchPendingBatch, processItem } from "./processor";

async function main(): Promise<void> {
  console.log("[worker] Starting resilient-integration-lab worker...");

  const config = loadConfig();
  console.log("[worker] Config loaded:", {
    mockApiUrl: config.mockApiUrl,
    concurrency: config.concurrency,
    batchSize: config.batchSize,
    pollIntervalMs: config.pollIntervalMs,
    retryMax: config.retryMax,
    retryBaseDelayMs: config.retryBaseDelayMs,
  });

  const pool = await connectWithRetry(config.dbUrl);

  console.log("[worker] Entering scheduled polling loop...");

  const loop = async (): Promise<void> => {
    try {
      const batch = await fetchPendingBatch(pool, config.batchSize);
      if (batch.length === 0) {
        console.log("[worker] No pending items — sleeping...");
      } else {
        console.log(`[worker] Processing batch of ${batch.length} item(s)...`);
        // TODO: replace with concurrent processing using config.concurrency
        for (const item of batch) {
          await processItem(item, config);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[worker] Error in polling loop: ${message}`);
    } finally {
      setTimeout(loop, config.pollIntervalMs);
    }
  };

  loop();
}

main().catch((err) => {
  console.error("[worker] Fatal error:", err);
  process.exit(1);
});
