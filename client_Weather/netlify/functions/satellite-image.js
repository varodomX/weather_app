const http = require("http");
const https = require("https");

const IMAGE_PATH = "/satmet/thai/ir_enh/ir_enh_thai.jpg";
const REQUEST_TIMEOUT_MS = 12000;

const SOURCES = [
  {
    protocol: "http:",
    hostname: "www.sattmet.tmd.go.th",
    path: IMAGE_PATH,
    headers: { Host: "www.sattmet.tmd.go.th" },
  },
  {
    protocol: "http:",
    hostname: "sattmet.tmd.go.th",
    path: IMAGE_PATH,
    headers: { Host: "sattmet.tmd.go.th" },
  },
  {
    protocol: "http:",
    hostname: "119.46.126.1",
    path: IMAGE_PATH,
    headers: { Host: "www.sattmet.tmd.go.th" },
  },
];

function fetchImage(source) {
  return new Promise((resolve, reject) => {
    const client = source.protocol === "https:" ? https : http;
    const request = client.request(
      {
        protocol: source.protocol,
        hostname: source.hostname,
        path: source.path,
        method: "GET",
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          Referer: "http://www.sattmet.tmd.go.th/",
          ...source.headers,
        },
      },
      (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          response.resume();
          const redirectUrl = new URL(response.headers.location, `${source.protocol}//${source.hostname}`);
          fetchImage({
            protocol: redirectUrl.protocol,
            hostname: redirectUrl.hostname,
            path: `${redirectUrl.pathname}${redirectUrl.search}`,
            headers: source.headers,
          }).then(resolve, reject);
          return;
        }

        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`${source.hostname} returned ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          resolve({
            buffer: Buffer.concat(chunks),
            contentType: response.headers["content-type"] || "image/jpeg",
          });
        });
      },
    );

    request.on("timeout", () => {
      request.destroy(new Error(`${source.hostname} timed out`));
    });
    request.on("error", reject);
    request.end();
  });
}

function fallbackSvg(errors) {
  const detail = errors.map((error) => error.message).join(" | ").slice(0, 220);
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
  <rect width="900" height="1200" fill="#f8fafc"/>
  <rect x="40" y="420" width="820" height="260" rx="28" fill="#fff7ed" stroke="#fb923c" stroke-width="6"/>
  <text x="450" y="520" text-anchor="middle" font-family="sans-serif" font-size="42" font-weight="700" fill="#9a3412">โหลดภาพดาวเทียมไม่ได้</text>
  <text x="450" y="585" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#7c2d12">ต้นทาง sattmet.tmd.go.th อาจไม่ตอบสนองชั่วคราว</text>
  <text x="450" y="642" text-anchor="middle" font-family="monospace" font-size="16" fill="#9a3412">${detail}</text>
</svg>`;
}

exports.handler = async () => {
  const errors = [];

  for (const source of SOURCES) {
    try {
      const image = await fetchImage(source);

      if (!image.buffer.length) {
        throw new Error(`${source.hostname} returned an empty image`);
      }

      return {
        statusCode: 200,
        headers: {
          "Content-Type": image.contentType,
          "Cache-Control": "public, max-age=300",
        },
        body: image.buffer.toString("base64"),
        isBase64Encoded: true,
      };
    } catch (error) {
      errors.push(error instanceof Error ? error : new Error(String(error)));
    }
  }

  const svg = fallbackSvg(errors);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: svg,
  };
};
