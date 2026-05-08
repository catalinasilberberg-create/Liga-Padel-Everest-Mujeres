-- LIGA DE PÁDEL EVEREST MUJERES — Datos iniciales
-- Ejecutar DESPUÉS de supabase_schema.sql

-- ============================================================
-- PAREJAS (44 total)
-- ============================================================

-- PRINCIPIANTE (ids 1-8)
insert into parejas (jugador1, jugador2, grupo) values
  ('María José Echeverría', 'Francisca Echeverría', 'principiante'),  -- 1
  ('Maria Jose Calvo', 'Rosario Sotomayor', 'principiante'),          -- 2
  ('Paulina Parentini', 'Maria Jose Guldman', 'principiante'),        -- 3
  ('Carmen Mena', 'Lorraine Halley-Harris', 'principiante'),          -- 4
  ('Karin Kraus', 'Maria Paz Montes', 'principiante'),                -- 5
  ('Marisol Valdivieso', 'Paula Bulnes', 'principiante'),             -- 6
  ('Magdalena Aguirre', 'Maria Jose Vergara', 'principiante'),        -- 7
  ('Francisca Berríos', 'Loreto Cifuentes', 'principiante');          -- 8

-- CATEGORÍA D — COPA ORO (ids 9-14)
insert into parejas (jugador1, jugador2, grupo) values
  ('Maria Jose Spoerer', 'Isidora Uriarte', 'd_copa_oro'),            -- 9
  ('Javiera Constenla', 'Macarena Muñoz', 'd_copa_oro'),              -- 10
  ('Carolina Benko', 'Carolina Court', 'd_copa_oro'),                 -- 11
  ('Fran Bauer', 'Gabi Focke', 'd_copa_oro'),                         -- 12
  ('Ignacia Zuloaga', 'Veronica Covarrubias', 'd_copa_oro'),          -- 13
  ('Josefina Riesco', 'Francisca Illanes', 'd_copa_oro');             -- 14

-- CATEGORÍA D — COPA PLATA 1 (ids 15-20)
insert into parejas (jugador1, jugador2, grupo) values
  ('Pilar Hurtado', 'Carola Sequenzia', 'd_copa_plata_1'),            -- 15
  ('Catalina Barros', 'Catalina Castro', 'd_copa_plata_1'),           -- 16
  ('Valentina Yavar', 'Trinidad Subercaseaux', 'd_copa_plata_1'),     -- 17
  ('Mariana Triffiletti', 'Rosario Perez de Arce', 'd_copa_plata_1'),-- 18
  ('Catalina Papic', 'Catalina Tagle', 'd_copa_plata_1'),             -- 19
  ('Magdalena Izquierdo', 'María Luisa Vega', 'd_copa_plata_1');      -- 20

-- CATEGORÍA D — COPA PLATA 2 (ids 21-26)
insert into parejas (jugador1, jugador2, grupo) values
  ('Josefina del Campo', 'Angelica Stuven', 'd_copa_plata_2'),        -- 21
  ('Claudia Weiss', 'Cecilia Rodríguez', 'd_copa_plata_2'),           -- 22
  ('Anita Yunge', 'Angelica Prieto', 'd_copa_plata_2'),               -- 23
  ('Josefina Aubert', 'Andrea Fernández', 'd_copa_plata_2'),          -- 24
  ('Javiera Sepúlveda', 'Malu Pasarón', 'd_copa_plata_2'),            -- 25
  ('Isabel Vial', 'Lucia Corbetto', 'd_copa_plata_2');                -- 26

-- CATEGORÍA C- (ids 27-36)
insert into parejas (jugador1, jugador2, grupo) values
  ('Ignacia Rojas', 'Javiera Herrera', 'c_menos'),                    -- 27
  ('Daniela Castro', 'Francisca Gil', 'c_menos'),                     -- 28
  ('Barbara Laissle', 'Macarena Hagelin', 'c_menos'),                 -- 29
  ('Macarena Swett', 'Luzma Guerrero', 'c_menos'),                    -- 30
  ('Paula Mendia', 'Carola Bier', 'c_menos'),                         -- 31
  ('Magdalena Philippi', 'Pacita Escala', 'c_menos'),                 -- 32
  ('Carla Álvarez', 'Javiera Valderrama', 'c_menos'),                 -- 33
  ('Daniela Bay', 'Yasmin Alarja', 'c_menos'),                        -- 34
  ('Josefina Pérez', 'Sol Fuenzalida', 'c_menos'),                    -- 35
  ('Valentina Cooper', 'María Paz Camposano', 'c_menos');             -- 36

-- CATEGORÍA C+ (ids 37-44)
insert into parejas (jugador1, jugador2, grupo) values
  ('Loreto Miquel', 'Soledad Aubert', 'c_mas'),                       -- 37
  ('Javiera Maturana', 'Carolina Hevia', 'c_mas'),                    -- 38
  ('María Elena Cuencio', 'Eugenia Nieva', 'c_mas'),                  -- 39
  ('Catalina Estartus', 'María José Ríos', 'c_mas'),                  -- 40
  ('Cata Silberberg', 'Caro Martija', 'c_mas'),                       -- 41
  ('Vir Ledesma', 'Jose Figueroa', 'c_mas'),                          -- 42
  ('Caty Lladser', 'Coto Barrientos', 'c_mas'),                       -- 43
  ('Ángeles Lobel', 'Jesús Troncoso', 'c_mas');                       -- 44

-- ============================================================
-- FECHAS (12 miércoles: 18 mar – 17 jun 2026)
-- ============================================================
insert into fechas (numero, fecha, label) values
  (1,  '2026-03-18', '1ª Fecha'),
  (2,  '2026-03-25', '2ª Fecha'),
  (3,  '2026-04-08', '3ª Fecha'),
  (4,  '2026-04-15', '4ª Fecha'),
  (5,  '2026-04-22', '5ª Fecha'),
  (6,  '2026-04-29', '6ª Fecha'),
  (7,  '2026-05-06', '7ª Fecha'),
  (8,  '2026-05-13', '8ª Fecha'),
  (9,  '2026-05-27', '9ª Fecha'),
  (10, '2026-06-03', '10ª Fecha'),
  (11, '2026-06-10', '11ª Fecha'),
  (12, '2026-06-17', '12ª Fecha');

-- ============================================================
-- FIXTURE — ver supabase_fixture.sql
-- ============================================================
-- Los partidos se cargan en supabase_fixture.sql
-- (archivo separado por volumen)
