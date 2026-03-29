import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

function toRow(t: Record<string, unknown>) {
  return {
    id: t.id,
    title: t.title ?? "Untitled",
    prompt: t.prompt ?? "",
    example: t.example ?? "",
    categories: Array.isArray(t.categories) ? t.categories : [],
    created_at: t.created_at ?? t.createdAt ?? new Date().toISOString().split("T")[0],
  };
}

function toClient(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    prompt: row.prompt,
    example: row.example ?? "",
    categories: row.categories ?? [],
    createdAt: row.created_at,
  };
}

export async function GET() {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(toClient));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const sb = createServerClient();
  const row = toRow({
    ...body,
    id: Date.now().toString(),
    created_at: new Date().toISOString().split("T")[0],
  });
  const { data, error } = await sb.from("templates").insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(toClient(data), { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const sb = createServerClient();
  const { id, ...rest } = body;
  const updates: Record<string, unknown> = {};
  if (rest.title !== undefined) updates.title = rest.title;
  if (rest.prompt !== undefined) updates.prompt = rest.prompt;
  if (rest.example !== undefined) updates.example = rest.example;
  if (rest.categories !== undefined) updates.categories = rest.categories;
  const { data, error } = await sb.from("templates").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(toClient(data));
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const sb = createServerClient();
  const { error } = await sb.from("templates").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
