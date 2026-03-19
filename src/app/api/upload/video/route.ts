import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("video")
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("video")
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    });
  } catch (err: any) {
    console.error("Video Upload Error:", err.message);
    return NextResponse.json(
      { success: false, message: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}