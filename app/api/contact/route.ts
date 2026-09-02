import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuid } from "uuid";

const MESSAGES_PATH = join(process.cwd(), "data", "messages.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const raw = await readFile(MESSAGES_PATH, "utf-8");
    const messages = JSON.parse(raw);

    const newMessage = {
      id: `msg_${uuid().slice(0, 8)}`,
      name,
      email,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    messages.unshift(newMessage);
    await writeFile(MESSAGES_PATH, JSON.stringify(messages, null, 2), "utf-8");

    return NextResponse.json(
      { success: true, message: "Message received" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
