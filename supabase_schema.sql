-- LIGA DE PÁDEL EVEREST MUJERES — Schema Supabase
-- Ejecutar en el SQL Editor de Supabase

create table parejas (
  id serial primary key,
  jugador1 text not null,
  jugador2 text not null,
  grupo text not null check (grupo in (
    'principiante',
    'd_copa_oro', 'd_copa_plata_1', 'd_copa_plata_2',
    'c_menos', 'c_mas'
  ))
);

create table fechas (
  id serial primary key,
  numero int not null,
  fecha date not null,
  label text not null
);

create table partidos (
  id serial primary key,
  fecha_id int references fechas(id),
  pareja1_id int references parejas(id),
  pareja2_id int references parejas(id),
  set1_p1 int,
  set1_p2 int,
  set2_p1 int,
  set2_p2 int,
  tb_p1 int,
  tb_p2 int,
  lugar text,
  cancha text,
  hora text,
  jugado boolean default false
);

-- Row Level Security
alter table parejas enable row level security;
alter table fechas enable row level security;
alter table partidos enable row level security;

create policy "Lectura publica" on parejas for select using (true);
create policy "Lectura publica" on fechas for select using (true);
create policy "Lectura publica" on partidos for select using (true);

create policy "Admin insert" on partidos for insert with check (true);
create policy "Admin update" on partidos for update using (true);
