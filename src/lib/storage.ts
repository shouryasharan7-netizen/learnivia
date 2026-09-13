import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://mydnrdbjzqccheegmvwy.supabase.co";

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

// Clean quotes if loaded from raw env strings
const cleanUrl = SUPABASE_URL.replace(/^["']|["']$/g, "").trim();
const cleanKey = SUPABASE_KEY.replace(/^["']|["']$/g, "").trim();

export const REPORT_CARDS_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "report-cards";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

let _supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseStorageClient() {
  if (!_supabaseClient && cleanUrl && cleanKey) {
    _supabaseClient = createClient(cleanUrl, cleanKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _supabaseClient;
}

/**
 * Validates document MIME type and file size.
 */
export function validateDocumentFile(file: { size: number; type: string; name?: string }) {
  if (!file) {
    return { valid: false, error: "No document file provided." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Document exceeds the 4MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please share a smaller file or Google Drive link.`,
    };
  }

  const mime = file.type?.toLowerCase();
  if (mime && !ALLOWED_MIME_TYPES.has(mime)) {
    // If MIME type is generic application/octet-stream, check extension
    const ext = file.name?.split(".").pop()?.toLowerCase();
    const validExts = ["pdf", "jpg", "jpeg", "png", "webp"];
    if (!ext || !validExts.includes(ext)) {
      return {
        valid: false,
        error: "Invalid file format. Only PDF, JPG, and PNG documents are allowed.",
      };
    }
  }

  return { valid: true, error: null };
}

/**
 * Uploads report card document to private Supabase Storage bucket.
 * Returns the storage key and detected mime type.
 */
export async function uploadReportCardToStorage({
  buffer,
  fileName,
  mimeType,
  userId,
}: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  userId: string;
}): Promise<{ storageKey: string | null; error: string | null }> {
  const client = getSupabaseStorageClient();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
  const storagePath = `tutors/${userId}/${Date.now()}-${sanitizedName}`;

  if (!client) {
    // Fallback if client is not configured
    return {
      storageKey: null,
      error: "Storage service is not configured. Please contact administrator.",
    };
  }

  try {
    const { data, error } = await client.storage
      .from(REPORT_CARDS_BUCKET)
      .upload(storagePath, buffer, {
        contentType: mimeType || "application/pdf",
        upsert: true,
      });

    if (error) {
      console.warn("Supabase storage upload error:", error.message);
      return { storageKey: null, error: error.message };
    }

    return { storageKey: data?.path || storagePath, error: null };
  } catch (err: any) {
    console.error("Storage upload exception:", err);
    return { storageKey: null, error: err.message || "Failed to upload document" };
  }
}

/**
 * Creates a time-limited signed URL for viewing a private report card.
 * Default expiration is 1 hour (3600 seconds).
 */
export async function getReportCardSignedUrl(
  storageKey: string,
  expiresInSeconds = 3600
): Promise<{ signedUrl: string | null; error: string | null }> {
  const client = getSupabaseStorageClient();
  if (!client) {
    return { signedUrl: null, error: "Storage client not initialized" };
  }

  try {
    const { data, error } = await client.storage
      .from(REPORT_CARDS_BUCKET)
      .createSignedUrl(storageKey, expiresInSeconds);

    if (error || !data?.signedUrl) {
      return { signedUrl: null, error: error?.message || "Could not generate signed URL" };
    }

    return { signedUrl: data.signedUrl, error: null };
  } catch (err: any) {
    return { signedUrl: null, error: err.message || "Signed URL exception" };
  }
}
