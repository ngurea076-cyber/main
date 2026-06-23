const http = require("node:http");

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

function getRequestUrl(req) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const forwardedHost = req.headers["x-forwarded-host"];
  const requestHost = forwardedHost || req.headers.host || `localhost:${port}`;
  return `${protocol}://${requestHost}${req.url || "/"}`;
}

function readBody(req) {
  if (req.method === "GET" || req.method === "HEAD") {
    return undefined;
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function sendResponse(nodeRes, webRes) {
  nodeRes.statusCode = webRes.status;
  webRes.headers.forEach((value, key) => {
    nodeRes.setHeader(key, value);
  });

  if (!webRes.body) {
    nodeRes.end();
    return;
  }

  const body = Buffer.from(await webRes.arrayBuffer());
  nodeRes.end(body);
}

async function start() {
  const entry = await import("./dist/server/server.js");
  const app = entry.default;

  if (!app || typeof app.fetch !== "function") {
    throw new Error("dist/server/server.js does not export a fetch handler");
  }

  const server = http.createServer(async (req, res) => {
    try {
      const body = await readBody(req);
      const request = new Request(getRequestUrl(req), {
        method: req.method,
        headers: req.headers,
        body,
      });
      const response = await app.fetch(request, process.env, {});
      await sendResponse(res, response);
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.setHeader("content-type", "text/plain; charset=utf-8");
      res.end("Internal Server Error");
    }
  });

  server.listen(port, host, () => {
    console.log(`Shop ICT server listening on ${host}:${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
