-- Prompts table
create table if not exists prompts (
  id text primary key,
  title text not null default '',
  prompt text not null default '',
  image text,
  categories text[] default '{}',
  created_at text not null default ''
);

-- Templates table
create table if not exists templates (
  id text primary key,
  title text not null default '',
  prompt text not null default '',
  example text default '',
  categories text[] default '{}',
  created_at text not null default ''
);

-- Allow public read/write (no auth for now)
alter table prompts enable row level security;
alter table templates enable row level security;

create policy "Public access prompts" on prompts for all using (true) with check (true);
create policy "Public access templates" on templates for all using (true) with check (true);
