import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, ANDINO_WHATSAPP } = process.env;

export async function POST(req: NextRequest) {
  const body = await req.json();

  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(body, null, 2));

  // check if the webhook request contains a message
  const message = body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  if (message?.type === "text") {
    // send a reply message
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${ANDINO_WHATSAPP}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: message.from,
        text: { body: "Echo: " + message.text.body },
        context: {
          message_id: message.id,
        },
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    console.log("Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse(null, { status: 403 });
  }
}
