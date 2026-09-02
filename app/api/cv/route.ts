import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function GET() {
  const cvPath = path.join(process.cwd(), "public", "resume.pdf");

  if (!existsSync(cvPath)) {
    return NextResponse.json(
      { error: "CV not found" },
      { status: 404 }
    );
  }

  const cvBuffer = await readFile(cvPath);

  return new NextResponse(cvBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="resume.pdf"',
    },
  });
}
