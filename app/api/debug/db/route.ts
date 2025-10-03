import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.page.count();
    return NextResponse.json({ ok: true, pages: count });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
