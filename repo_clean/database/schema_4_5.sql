-- ============================================
-- PROJECTS
-- ============================================

create table projects (
id uuid primary key default gen_random_uuid(),
user_id uuid not null,
name text not null,
created_at timestamp default now()
);

alter table projects enable row level security;

create policy "select_projects"
on projects for select
using (user_id = auth.uid());

create policy "insert_projects"
on projects for insert
with check (user_id = auth.uid());

create policy "update_projects"
on projects for update
using (user_id = auth.uid());

create policy "delete_projects"
on projects for delete
using (user_id = auth.uid());

-- ============================================
-- CALC_MASTER
-- ============================================

create table calc_master (
id uuid primary key default gen_random_uuid(),
project_id uuid not null references projects(id) on delete cascade,
name text not null,
locked boolean default true,
created_at timestamp default now()
);

alter table calc_master enable row level security;

create policy "select_calc_master"
on calc_master for select
using (
project_id in (
select id from projects where user_id = auth.uid()
)
);

create policy "insert_calc_master"
on calc_master for insert
with check (
project_id in (
select id from projects where user_id = auth.uid()
)
);

create policy "update_calc_master"
on calc_master for update
using (
project_id in (
select id from projects where user_id = auth.uid()
)
);

-- ============================================
-- CALC_VERSIONS
-- ============================================

create table calc_versions (
id uuid primary key default gen_random_uuid(),
project_id uuid not null references projects(id) on delete cascade,
master_id uuid not null references calc_master(id) on delete cascade,
version_type text not null check (version_type in ('master','optimalisatie')),
created_at timestamp default now()
);

alter table calc_versions enable row level security;

create policy "select_calc_versions"
on calc_versions for select
using (
project_id in (
select id from projects where user_id = auth.uid()
)
);

create policy "insert_calc_versions"
on calc_versions for insert
with check (
project_id in (
select id from projects where user_id = auth.uid()
)
);

create policy "update_calc_versions"
on calc_versions for update
using (
project_id in (
select id from projects where user_id = auth.uid()
)
);

-- ============================================
-- CALC_LINES
-- ============================================

create table calc_lines (
id uuid primary key default gen_random_uuid(),
version_id uuid not null references calc_versions(id) on delete cascade,
stabu_code text not null,
omschrijving text not null,
categorie int not null,
aantal numeric not null,
stabu_prijs numeric not null,
inkoop_prijs numeric,
verkoop_prijs numeric,
materiaal_prijs numeric,
arbeid_uren numeric,
arbeid_tarief numeric,
totale_kosten numeric,
locked boolean default false
);

alter table calc_lines enable row level security;

create policy "select_calc_lines"
on calc_lines for select
using (
version_id in (
select id from calc_versions where project_id in (
select id from projects where user_id = auth.uid()
)
)
);

-- UPDATE POLICY: FIXED PRICE MODULE
-- Alleen categorie 1,2,3 mogen prijzen aanpassen
-- STABU, uren, tarieven blijven altijd gelijk
create policy "update_fixedprice_calc_lines"
on calc_lines for update
using (
version_id in (
select id from calc_versions where project_id in (
select id from projects where user_id = auth.uid()
)
)
)
with check (
categorie in (1,2,3)
and stabu_prijs = old.stabu_prijs
and arbeid_uren = old.arbeid_uren
and arbeid_tarief = old.arbeid_tarief
and locked = old.locked
);

-- VERBOD OP UPDATE CATEGORIE 4
create policy "deny_update_categorie_4"
on calc_lines for update
using (categorie = 4)
with check (false);

-- ============================================
-- LEVERANCIERS
-- ============================================

create table leveranciers (
id uuid primary key default gen_random_uuid(),
naam text not null,
contactpersoon text,
email text,
contractnummer text
);

alter table leveranciers enable row level security;

create policy "select_leveranciers"
on leveranciers for select
using (true);

create policy "admin_modify_leveranciers"
on leveranciers for all
to service_role
using (true)
with check (true);

-- ============================================
-- ARTIKEL BESTANDEN
-- ============================================

create table artikel_bestanden (
id uuid primary key default gen_random_uuid(),
artikelcode text not null,
omschrijving text,
standaard_prijs numeric,
leverancier_id uuid references leveranciers(id),
leverancier_prijs numeric,
laatste_update timestamp default now()
);

alter table artikel_bestanden enable row level security;

create policy "select_artikel_bestanden"
on artikel_bestanden for select
using (true);

create policy "admin_update_artikel_bestanden"
on artikel_bestanden for update
to service_role
using (true)
with check (true);

-- ============================================
-- CALC PRICING LOG
-- ============================================

create table calc_pricing_log (
id uuid primary key default gen_random_uuid(),
calc_line_id uuid references calc_lines(id) on delete cascade,
old_price numeric,
new_price numeric,
source text not null,
timestamp timestamp default now(),
user_id uuid not null
);

alter table calc_pricing_log enable row level security;

create policy "insert_pricing_log"
on calc_pricing_log for insert
with check (user_id = auth.uid());

create policy "select_pricing_log"
on calc_pricing_log for select
using (
calc_line_id in (
select id from calc_lines where version_id in (
select id from calc_versions where project_id in (
select id from projects where user_id = auth.uid()
)
)
)
);

-- ============================================
-- EINDE MIGRATIE
-- ============================================
