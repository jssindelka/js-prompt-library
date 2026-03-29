import { createClient } from '@supabase/supabase-js'
import prompts from '../data/prompts.json'
import templates from '../data/templates.json'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function migrate() {
  console.log('Migrating prompts...')
  for (const p of prompts as Record<string, unknown>[]) {
    const { error } = await supabase.from('prompts').upsert({
      id: String(p.id),
      title: p.title ?? '',
      prompt: p.prompt ?? '',
      image: p.image ?? null,
      categories: Array.isArray(p.categories) ? p.categories : [],
      created_at: p.createdAt ?? '',
    })
    if (error) console.error('Prompt error:', error.message, p.id)
    else console.log('  ✓ prompt', p.id)
  }

  console.log('Migrating templates...')
  for (const t of templates as Record<string, unknown>[]) {
    const { error } = await supabase.from('templates').upsert({
      id: String(t.id),
      title: t.title ?? 'Untitled',
      prompt: t.prompt ?? '',
      example: t.example ?? '',
      categories: Array.isArray(t.categories) ? t.categories : [],
      created_at: t.createdAt ?? '',
    })
    if (error) console.error('Template error:', error.message, t.id)
    else console.log('  ✓ template', t.id)
  }

  console.log('Done!')
}

migrate()
