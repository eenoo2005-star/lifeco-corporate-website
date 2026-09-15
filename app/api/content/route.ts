import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getChatGPTUser } from "@/app/chatgpt-auth";

const ADMIN_EMAIL = "eenoo2005@gmail.com";
const itemSchema = z.object({
  kind: z.enum(["news", "tender"]), titleEn: z.string().trim().min(3).max(180), titleAr: z.string().trim().min(3).max(180),
  summaryEn: z.string().trim().min(3).max(900), summaryAr: z.string().trim().min(3).max(900), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["published", "draft"]).default("published"),
});

async function requireAdmin() { const user = await getChatGPTUser(); return user?.email.toLowerCase() === ADMIN_EMAIL ? user : null; }

export async function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind");
  const admin = await requireAdmin();
  const where = kind === "news" || kind === "tender" ? "WHERE kind = ?" : "";
  const statusClause = admin ? "" : where ? " AND status = 'published'" : "WHERE status = 'published'";
  const statement = env.DB.prepare(`SELECT id, kind, title_en AS titleEn, title_ar AS titleAr, summary_en AS summaryEn, summary_ar AS summaryAr, date, status FROM content_items ${where}${statusClause} ORDER BY date DESC, id DESC`);
  const result = kind === "news" || kind === "tender" ? await statement.bind(kind).all() : await statement.all();
  return NextResponse.json(result.results ?? []);
}

export async function POST(request: Request) {
  const user = await requireAdmin(); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const parsed = itemSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid content", details: parsed.error.flatten() }, { status: 400 });
  const v = parsed.data; const createdAt = new Date().toISOString();
  const result = await env.DB.prepare("INSERT INTO content_items (kind, title_en, title_ar, summary_en, summary_ar, date, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(v.kind, v.titleEn, v.titleAr, v.summaryEn, v.summaryAr, v.date, v.status, user.email, createdAt).run();
  return NextResponse.json({ id: result.meta.last_row_id }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await requireAdmin(); if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const id = Number(new URL(request.url).searchParams.get("id")); if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await env.DB.prepare("DELETE FROM content_items WHERE id = ?").bind(id).run();
  return NextResponse.json({ ok: true });
}
