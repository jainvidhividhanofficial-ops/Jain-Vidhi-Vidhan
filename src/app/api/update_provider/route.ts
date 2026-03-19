import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { id, updatedFields } = await req.json();

    if (!id || !updatedFields)
      return NextResponse.json({ error: "Missing ID or fields" }, { status: 400 });

    const { data, error } = await supabase
      .from("providers")
      .update(updatedFields)
      .eq("id", id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Update API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
