import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = file.name.split(".").pop();
    const fileName = `profile_${providerId}.${ext}`;

    // ✅ Upload to your bucket named "image"
    const { data, error } = await supabase.storage
      .from("image")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true, // Replace old image if exists
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    // ✅ Get public URL (from 'image' bucket)
    const { data: publicData } = supabase.storage
      .from("image")
      .getPublicUrl(fileName);

    const imageUrl = publicData.publicUrl;
    console.log("✅ Uploaded image URL:", imageUrl);

    // ✅ Update the provider record in DB
    const { data: updateData, error: updateError } = await supabase
      .from("providers")
      .update({ profileimageurl: imageUrl })
      .eq("id", providerId)
      .select();

    if (updateError) {
      console.error("DB update error:", updateError);
      return NextResponse.json(
        { success: false, message: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image uploaded and profile updated",
      url: imageUrl,
      data: updateData,
    });
  } catch (err: any) {
    console.error("❌ update_profile_image API error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
