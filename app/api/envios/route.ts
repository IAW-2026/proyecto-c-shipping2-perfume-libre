import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getEnvios } from "@/lib/envios";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const envios = await getEnvios(userId);
  return NextResponse.json(envios);
}
