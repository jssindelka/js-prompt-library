import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function toClient(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    title: row.title,
    prompt: row.prompt,
    image: row.image ?? null,
    categories: Array.isArray(row.categories) ? row.categories : [],
    createdAt: row.created_at,
  };
}

export async function GET() {
  const sql = getDb();
  const rows = await sql`SELECT * FROM prompts ORDER BY created_at DESC`;
  return NextResponse.json(rows.map(toClient));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sql = getDb();
  const id = Date.now().toString();
  const createdAt = new Date().toISOString().split("T")[0];
  const rows = await sql`
    INSERT INTO prompts (id, title, prompt, image, categories, created_at)
    VALUES (${id}, ${body.title ?? ""}, ${body.prompt ?? ""}, ${body.image ?? null}, ${body.categories ?? []}, ${createdAt})
    RETURNING *
  `;
  return NextResponse.json(toClient(rows[0] as Record<string, unknown>), { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const sql = getDb();
  const { id, title, prompt, image, categories } = body;
  const rows = await sql`
    UPDATE prompts SET
      title = COALESCE(${title ?? null}, title),
      prompt = COALESCE(${prompt ?? null}, prompt),
      image = COALESCE(${image ?? null}, image),
      categories = COALESCE(${categories ?? null}, categories)
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json(toClient(rows[0] as Record<string, unknown>));
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const sql = getDb();
  await sql`DELETE FROM prompts WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
