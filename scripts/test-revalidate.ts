/**
 * Test script for the /api/revalidate endpoint.
 *
 * Usage:
 *   npx tsx scripts/test-revalidate.ts [url]
 *
 * Examples:
 *   npx tsx scripts/test-revalidate.ts                          # defaults to localhost:3000
 *   npx tsx scripts/test-revalidate.ts http://localhost:3000
 *   npx tsx scripts/test-revalidate.ts https://nackamoderaterna.se
 *   npx tsx scripts/test-revalidate.ts https://www.nackamoderaterna.se
 */

import crypto from "node:crypto";

const SECRET = process.env.SANITY_REVALIDATE_SECRET ?? "";
if (!SECRET) {
  console.error("Error: SANITY_REVALIDATE_SECRET env variable is required");
  process.exit(1);
}

const baseUrl = process.argv[2] ?? "http://localhost:3000";
const endpoint = `${baseUrl.replace(/\/$/, "")}/api/revalidate`;

const payload: Record<string, unknown> = {
  _type: "page",
  _id: "test-revalidate-script",
  slug: "hem",
};

const body = JSON.stringify(payload);
const timestamp = Date.now();

// next-sanity/webhook signs as: HMAC-SHA256("${timestamp}.${body}", secret)
// then base64url-encodes the result, header format: t=<ts>,v1=<sig>
const hmac = crypto
  .createHmac("sha256", SECRET)
  .update(`${timestamp}.${body}`)
  .digest("base64url");

const signature = `t=${timestamp},v1=${hmac}`;

console.log(`\n--- Revalidation Test ---`);
console.log(`Target:    ${endpoint}`);
console.log(`Payload:   ${body}`);
console.log(`Signature: ${signature}\n`);

async function sendRequest(url: string, followRedirects: boolean) {
  const label = followRedirects
    ? "WITH redirect follow"
    : "WITHOUT redirect follow";
  console.log(`[${label}] POST ${url}`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "sanity-webhook-signature": signature,
    },
    body,
    redirect: followRedirects ? "follow" : "manual",
  });

  console.log(`  Status: ${res.status} ${res.statusText}`);

  if (!followRedirects && res.status >= 300 && res.status < 400) {
    const location = res.headers.get("location");
    console.log(`  Location: ${location}`);
    console.log(
      `  ⚠ Redirect detected! Signature will be invalid after redirect.`
    );
  }

  try {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log(`  Body:`, JSON.stringify(json, null, 2));
    } catch {
      console.log(`  Body: ${text.slice(0, 500)}`);
    }
  } catch {
    console.log(`  Body: (could not read)`);
  }

  console.log();
  return res;
}

async function main() {
  // Test 1: Send without following redirects to detect if a redirect happens
  console.log("=== Test 1: Detect redirect ===");
  await sendRequest(endpoint, false);

  // Test 2: Send with redirect follow to see what actually happens
  console.log("=== Test 2: Follow redirects ===");
  await sendRequest(endpoint, true);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
