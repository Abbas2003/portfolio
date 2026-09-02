import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuid } from "uuid";

const MESSAGES_PATH = join(process.cwd(), "data", "messages.json");

async function readMessages() {
  const raw = await readFile(MESSAGES_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeMessages(messages: unknown[]) {
  await writeFile(MESSAGES_PATH, JSON.stringify(messages, null, 2), "utf-8");
}

export async function GET() {
  try {
    const messages = await readMessages();
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: "Failed to read messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages = await readMessages();
    const newMessage = {
      id: `msg_${uuid().slice(0, 8)}`,
      ...body,
      read: false,
      createdAt: new Date().toISOString(),
    };
    messages.unshift(newMessage);
    await writeMessages(messages);
    return NextResponse.json({ success: true, message: newMessage });
  } catch {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const messages = await readMessages();
    const filtered = messages.filter((m: { id: string }) => m.id !== id);
    await writeMessages(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
