import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const target = formData.get("target"); // "profile.jpg" or "resume.pdf"

  if (!file || typeof target !== "string") {
    return NextResponse.json({ error: "Missing file or target" }, { status: 400 });
  }

  const buffer = Buffer.from(await (file as File).arrayBuffer());
  const filePath = join(process.cwd(), "public", target);

  await writeFile(filePath, buffer);

  // Return the new URL for the file
  return NextResponse.json({ url: `/${target}` });
} 