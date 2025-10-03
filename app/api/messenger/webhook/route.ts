import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN!;
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "OK", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || body.object !== "page") return NextResponse.json({ ok: true });

  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  for (const entry of body.entry || []) {
    for (const event of entry.messaging || []) {
      const senderId = event.sender?.id;
      const messageText =
        event.message?.text ??
        event.postback?.title ??
        event.postback?.payload ??
        "";

      if (!senderId || !messageText) continue;

      const reply = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Bạn là trợ lý bán hàng lịch sự, trả lời ngắn gọn (≤50 từ)." },
          { role: "user", content: messageText }
        ],
        temperature: 0.5,
        max_tokens: 120
      });

      const text =
        reply.choices?.[0]?.message?.content?.slice(0, 500) ||
        "Mình đã nhận được tin nhắn của bạn!";

      await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: senderId },
          messaging_type: "RESPONSE",
          message: { text }
        })
      }).catch(() => {});
    }
  }
  return NextResponse.json({ ok: true });
}
