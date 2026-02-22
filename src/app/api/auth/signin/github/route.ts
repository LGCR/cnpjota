import { signIn } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  return await signIn("github", { redirectTo: callbackUrl });
}

export async function POST(request: NextRequest) {
  return await signIn("github", { redirectTo: "/dashboard" });
}
