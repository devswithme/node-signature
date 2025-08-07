import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    if (
      req.headers.get("Authorization")?.split(" ")[1] == process.env.API_KEY
    ) {
      const { body, signature } = await req.json();
      const privateKey = process.env.PRIVATE_KEY!;

      const hmac = crypto
        .createHmac("sha256", privateKey)
        .update(JSON.stringify(body))
        .digest("hex");

      return NextResponse.json({
        success: true,
        data: Boolean(hmac == signature),
      });
    } else {
      return NextResponse.json({ success: false, data: "Unauthorized" });
    }
  } catch (err) {
    return NextResponse.json({ success: false, data: err });
  }
}
