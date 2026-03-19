import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    console.log("🔵 API Route hit: /api/provider");
    
    const data = await req.json();
    console.log("📥 Received data:", JSON.stringify(data, null, 2));
    
    // Map form data to database schema
    const payload = {
      providername: data.providerName || "",
      qualification: data.qualification || "",
      institute: data.institute || "",
      providertype: data.providerType || [],
      contactemail: data.contactEmail || "",
      contactphone: data.contactPhone || "",
      servicearea: data.serviceArea || "",
      yearsexperience: parseInt(String(data.yearsExperience || "0"), 10),
      shortdescription: data.shortDescription || "",
      servicesoffered: data.servicesOffered || "",
      profileimageurl: data.profileImageUrl || "",
      videourls: data.videoUrls || [],
      services_pricing: data.servicesPricing || [],
      created_at: new Date().toISOString(),
    };

    console.log("📦 Payload to insert:", JSON.stringify(payload, null, 2));

    const { data: result, error } = await supabase
      .from("providers")
      .insert([payload])
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Insert successful:", result);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Provider registered successfully!",
    });
  } catch (err: any) {
    console.error("❌ Provider Save Error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Database error" },
      { status: 500 }
    );
  }
}
