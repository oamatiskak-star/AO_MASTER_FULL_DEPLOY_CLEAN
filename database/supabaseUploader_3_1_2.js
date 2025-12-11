import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// upload bestand naar bucket ai_modules
export async function uploadToSupabase(filePath, fileName) {
  const bucket = "ai_modules";

  const fileBuffer = fs.readFileSync(filePath);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, fileBuffer, {
      upsert: true,
      contentType: "application/zip"
    });

  if (error) throw error;

  return data;
}
