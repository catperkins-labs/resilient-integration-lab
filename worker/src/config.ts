/** Worker environment configuration — all sourced from environment variables. */
export interface WorkerConfig {
  dbUrl: string;
  mockApiUrl: string;
  concurrency: number;
  batchSize: number;
  pollIntervalMs: number;
  retryMax: number;
  retryBaseDelayMs: number;
}

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function parseIntEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined) return fallback;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be an integer, got: "${raw}"`);
  }
  return parsed;
}

export function loadConfig(): WorkerConfig {
  return {
    dbUrl: requireEnv("WORKER_DB_URL", "postgresql://postgres:postgres@localhost:5432/resilientlab"),
    mockApiUrl: requireEnv("MOCK_API_URL", "http://localhost:8090"),
    concurrency: parseIntEnv("WORKER_CONCURRENCY", 5),
    batchSize: parseIntEnv("WORKER_BATCH_SIZE", 20),
    pollIntervalMs: parseIntEnv("WORKER_POLL_INTERVAL_MS", 5000),
    retryMax: parseIntEnv("WORKER_RETRY_MAX", 3),
    retryBaseDelayMs: parseIntEnv("WORKER_RETRY_BASE_DELAY_MS", 500),
  };
}
