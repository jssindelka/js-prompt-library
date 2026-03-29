import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  const promptsPath = path.join(process.cwd(), "data", "prompts.json");
  const templatesPath = path.join(process.cwd(), "data", "templates.json");

  const prompts = JSON.parse(fs.readFileSync(promptsPath, "utf-8"));
  const templates = JSON.parse(fs.readFileSync(templatesPath, "utf-8"));

  console.log("Migrating prompts...");
  for (const p of prompts) {
    try {
      await sql`
        INSERT INTO prompts (id, title, prompt, image, categories, created_at)
        VALUES (${String(p.id)}, ${p.title ?? ""}, ${p.prompt ?? ""}, ${p.image ?? null}, ${p.categories ?? []}, ${p.createdAt ?? ""})
        ON CONFLICT (id) DO NOTHING
      `;
      console.log("  ✓ prompt", p.id);
    } catch (e) {
      console.error("  ✗ prompt", p.id, e);
    }
  }

  console.log("Migrating templates...");
  for (const t of templates) {
    try {
      await sql`
        INSERT INTO templates (id, title, prompt, example, categories, created_at)
        VALUES (${String(t.id)}, ${t.title ?? "Untitled"}, ${t.prompt ?? ""}, ${t.example ?? ""}, ${t.categories ?? []}, ${t.createdAt ?? ""})
        ON CONFLICT (id) DO NOTHING
      `;
      console.log("  ✓ template", t.id);
    } catch (e) {
      console.error("  ✗ template", t.id, e);
    }
  }

  console.log("Done!");
  process.exit(0);
}

migrate();
