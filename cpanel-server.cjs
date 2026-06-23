const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const clientDir = path.join(__dirname, "dist", "client");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function loadDotEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

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

function sendStaticFile(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return false;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(getRequestUrl(req)).pathname);
  } catch {
    return false;
  }

  const relativePath = pathname === "/" ? "" : pathname.replace(/^\/+/, "");
  if (!relativePath) {
    return false;
  }

  const filePath = path.resolve(clientDir, relativePath);
  if (!filePath.startsWith(clientDir + path.sep)) {
    return false;
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return false;
  }

  res.statusCode = 200;
  res.setHeader("content-type", mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream");
  res.setHeader("cache-control", filePath.includes(`${path.sep}assets${path.sep}`) ? "public, max-age=31536000, immutable" : "public, max-age=300");

  if (req.method === "HEAD") {
    res.end();
    return true;
  }

  fs.createReadStream(filePath)
    .on("error", (error) => {
      console.error(error);
      if (!res.headersSent) {
        res.statusCode = 500;
      }
      res.end();
    })
    .pipe(res);
  return true;
}

async function start() {
  loadDotEnv();

  const entry = await import("./dist/server/server.js");
  const app = entry.default;

  if (!app || typeof app.fetch !== "function") {
    throw new Error("dist/server/server.js does not export a fetch handler");
  }

  const server = http.createServer(async (req, res) => {
    try {
      if (sendStaticFile(req, res)) {
        return;
      }

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
