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
    const providerId = formData.get("providerId") as string | null;

    if (!file || !providerId) {
      return NextResponse.json(
        { success: false, message: "Missing file or provider ID" },
        { status: 400 }
      );
    }

    // 🔹 Step 1: Fetch existing videos from DB
    const { data: provider, error: fetchError } = await supabase
      .from("providers")
      .select("videourls")
      .eq("id", providerId)
      .single();

    if (fetchError) {
      console.error("❌ Fetch error:", fetchError);
      throw fetchError;
    }

    const existingVideos: string[] = provider?.videourls || [];

    if (existingVideos.length >= 3) {
      return NextResponse.json(
        { success: false, message: "You can upload a maximum of 3 videos." },
        { status: 400 }
      );
    }

    // 🔹 Step 2: Upload new video to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.split(".").pop();
    const filename = `video_${providerId}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("video")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ Storage upload error:", uploadError);
      throw uploadError;
    }

    // 🔹 Step 3: Generate public URL
    const { data: urlData } = supabase.storage
      .from("video")
      .getPublicUrl(filename);

    const newVideoUrl = urlData.publicUrl;

    // 🔹 Step 4: Update provider record
    const updatedVideos = [...existingVideos, newVideoUrl];

    const { error: updateError } = await supabase
      .from("providers")
      .update({ videourls: updatedVideos })
      .eq("id", providerId)
      .select();

    if (updateError) {
      console.error("❌ DB update error:", updateError);
      throw updateError;
    }

    // 🔹 Step 5: Respond success
    return NextResponse.json({
      success: true,
      message: "Video uploaded successfully",
      url: newVideoUrl,
      allVideos: updatedVideos,
    });
  } catch (err: any) {
    console.error("❌ Video Upload Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
