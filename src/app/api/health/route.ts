export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Production Edge Health Check Endpoint
 * Measures round-trip ping latency to Supabase PostgreSQL via Edge runtime.
 */
export async function GET() {
  const startTime = Date.now();
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://mydnrdbjzqccheegmvwy.supabase.co";
  const supabaseUrl = rawUrl.replace(/^["']|["']$/g, "").trim().includes("mydnrdbjzqccheegmvwy")
    ? rawUrl.replace(/^["']|["']$/g, "").trim()
    : "https://mydnrdbjzqccheegmvwy.supabase.co";
  const supabaseKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  ).replace(/^["']|["']$/g, "").trim();

  const isDev = process.env.NODE_ENV !== "production" && process.env.VERCEL_ENV !== "production";
  // Use a relaxed threshold in dev to avoid false-503s from cold-start latency
  const LATENCY_THRESHOLD_MS = isDev ? 3000 : 800;

  let isHealthy = false;
  let latencyMs = 0;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LATENCY_THRESHOLD_MS);

    const pingStart = Date.now();
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);
    latencyMs = Date.now() - pingStart;

    if (res.status < 500 && latencyMs < LATENCY_THRESHOLD_MS) {
      isHealthy = true;
    }
  } catch {
    latencyMs = Date.now() - startTime;
    isHealthy = false;
  }

  const environment = isDev ? "development" : "production";
  const statusCode = isHealthy && latencyMs < LATENCY_THRESHOLD_MS ? 200 : 503;

  return new Response(
    JSON.stringify({
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      latency_ms: latencyMs,
      service: "learnivia-core",
      environment,
    }),
    {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
