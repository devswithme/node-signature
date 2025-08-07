import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    if (
      req.headers.get("Authorization")?.split(" ")[1] == process.env.API_KEY
    ) {
      const { merchant_ref, amount } = await req.json();
      const privateKey = process.env.PRIVATE_KEY!;
      const merchant_code = process.env.MERCHANT_CODE!;

      const hmac = crypto.createHmac("sha256", privateKey);
      hmac.update(`${merchant_code}${merchant_ref}${amount}`);

      const signature = hmac.digest("hex");

      return NextResponse.json({ success: true, data: signature });
    } else {
      return NextResponse.json({ success: false, data: "Unautorized" });
    }
  } catch (err) {
    return NextResponse.json({ success: false, data: err });
  }
}
