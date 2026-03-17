import http from "http";

const PORT = parseInt(process.env["MOCK_API_PORT"] ?? "8090", 10);

type Handler = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => void;

const routes: Record<string, Handler> = {
  "GET /health": (_req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
  },

  // Stub: simulate processing an item
  "POST /process": (req, res) => {
    const MAX_BODY_BYTES = 64 * 1024; // 64 KB limit
    let body = "";
    let bodySize = 0;

    req.on("data", (chunk: Buffer) => {
      bodySize += chunk.length;
      if (bodySize > MAX_BODY_BYTES) {
        req.destroy();
        res.writeHead(413, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "payload_too_large" }));
        return;
      }
      body += chunk;
    });
    req.on("end", () => {
      if (res.headersSent) return;
      console.log(`[mock-api] POST /process body=${body}`);
      // Randomly simulate success or transient failure for testing retry logic
      const rand = Math.random();
      if (rand < 0.1) {
        // 10% rate-limit
        res.writeHead(429, { "Content-Type": "application/json", "Retry-After": "1" });
        res.end(JSON.stringify({ error: "rate_limited" }));
      } else if (rand < 0.2) {
        // 10% server error
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "internal_error" }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      }
    });
  },
};

const server = http.createServer((req, res) => {
  const key = `${req.method} ${req.url}`;
  const handler = routes[key];
  if (handler) {
    handler(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not_found", path: req.url }));
  }
});

server.listen(PORT, () => {
  console.log(`[mock-api] Listening on port ${PORT}`);
});
