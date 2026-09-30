export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Production Edge Health Check Endpoint
 * Measures round-trip ping latency to Supabase PostgreSQL via Edge runtime.
 */
export async function GET() {
  const startTime = Date.now();
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://shsgqluaqexqwoxuakzr.supabase.co";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  let isHealthy = false;
  let latencyMs = 0;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);

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

    if (res.status < 500 && latencyMs < 800) {
      isHealthy = true;
    }
  } catch {
    latencyMs = Date.now() - startTime;
    isHealthy = false;
  }

  const environment =
    process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production"
      ? "production"
      : "development";
  const statusCode = isHealthy && latencyMs < 800 ? 200 : 503;

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
