-- LIGA DE PÁDEL EVEREST MUJERES — Fixture completo
-- Ejecutar DESPUÉS de supabase_datos_iniciales.sql
--
-- Nota: Fecha 1 verificada desde el Excel.
-- Fechas 2+ generadas con algoritmo round-robin.
-- Verificar cruces contra el Excel si hay discrepancias.
--
-- IDs de parejas:
-- Principiante:   1=Echeverría-Echeverría, 2=Calvo-Sotomayor, 3=Parentini-Guldman,
--                 4=Mena-Halley, 5=Kraus-Montes, 6=Valdivieso-Bulnes,
--                 7=Aguirre-Vergara, 8=Berríos-Cifuentes
-- D Copa Oro:     9=Spoerer-Uriarte, 10=Constenla-Muñoz, 11=Benko-Court,
--                 12=Bauer-Focke, 13=Zuloaga-Covarrubias, 14=Riesco-Illanes
-- D Copa Plata1: 15=Hurtado-Sequenzia, 16=Barros-Castro, 17=Yavar-Sub,
--                18=Triffiletti-Pérez, 19=Papic-Tagle, 20=Izquierdo-Vega
-- D Copa Plata2: 21=DelCampo-Stuven, 22=Weiss-Rodríguez, 23=Yunge-Prieto,
--                24=Aubert-Fernández, 25=Pasarón-Sepúlveda, 26=Corbetto-Vial
-- C-:            27..36   C+: 37..44
--
-- Grupos fase 1 (D):
--   Grupo1: 9(Spoerer), 19(Papic), 10(Constenla), 25(Pasarón), 18(Triffiletti), 26(Corbetto)
--   Grupo2: 12(Bauer), 16(Barros), 11(Benko), 17(Yavar), 20(Izquierdo), 21(DelCampo)
--   Grupo3: 15(Hurtado), 13(Zuloaga), 24(Aubert), 14(Riesco), 22(Weiss), 23(Yunge)

-- ============================================================
-- FECHA 1 — Miércoles 18 Marzo 2026 (verificado desde Excel)
-- ============================================================

-- PRINCIPIANTE
insert into partidos (fecha_id, pareja1_id, pareja2_id, hora, lugar, cancha) values
  (1, 3, 1, '18:30', 'Everest', '1'),
  (1, 4, 2, '19:30', 'Everest', '2'),
  (1, 6, 5, '18:00', 'PLT', '1'),
  (1, 8, 7, '19:00', 'PLT', '1');

-- D GRUPO 1 (fase 1)
insert into partidos (fecha_id, pareja1_id, pareja2_id, hora, lugar, cancha) values
  (1, 10, 9,  '18:00', 'PLT', '2'),
  (1, 25, 19, '19:00', 'PLT', '2'),
  (1, 26, 18, '20:00', 'PLT', '1');

-- D GRUPO 2 (fase 1) — horas/cancha aprox.
insert into partidos (fecha_id, pareja1_id, pareja2_id, hora, lugar, cancha) values
  (1, 11, 12, '18:00', 'PLT', '3'),
  (1, 17, 16, '19:00', 'PLT', '3'),
  (1, 21, 20, '20:00', 'PLT', '3');

-- D GRUPO 3 (fase 1)
insert into partidos (fecha_id, pareja1_id, pareja2_id, hora, lugar, cancha) values
  (1, 24, 15, '18:00', 'PLT', '4'),
  (1, 13, 22, '19:00', 'PLT', '4'),
  (1, 23, 14, '20:00', 'PLT', '4');

-- C-
insert into partidos (fecha_id, pareja1_id, pareja2_id, hora, lugar, cancha) values
  (1, 36, 27, '18:30', 'Everest', '1'),
  (1, 32, 31, '19:30', 'Everest', '2'),
  (1, 34, 29, '18:00', 'PLT', '5'),
  (1, 33, 30, '19:00', 'PLT', '5'),
  (1, 35, 28, '20:00', 'PLT', '4');

-- C+
insert into partidos (fecha_id, pareja1_id, pareja2_id, hora, lugar, cancha) values
  (1, 42, 41, '18:00', 'PLT', '6'),
  (1, 40, 38, '19:00', 'PLT', '6'),
  (1, 39, 37, '20:00', 'PLT', '5'),
  (1, 44, 43, '20:00', 'PLT', '6');

-- ============================================================
-- FECHA 2 — Miércoles 25 Marzo 2026
-- ============================================================

-- PRINCIPIANTE (RR round 2: 1v7, 8v6, 2v5, 3v4)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (2, 1, 7), (2, 8, 6), (2, 2, 5), (2, 3, 4);

-- D GRUPO 1 R2: (9,18),(26,25),(19,10)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (2, 9, 18), (2, 26, 25), (2, 19, 10);

-- D GRUPO 2 R2: (12,20),(21,17),(16,11)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (2, 12, 20), (2, 21, 17), (2, 16, 11);

-- D GRUPO 3 R2: (15,22),(23,14),(13,24)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (2, 15, 22), (2, 23, 14), (2, 13, 24);

-- C- R2: (27,35),(36,34),(28,33),(29,32),(30,31)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (2, 27, 35), (2, 36, 34), (2, 28, 33), (2, 29, 32), (2, 30, 31);

-- C+ R2: (37,43),(44,42),(38,41),(39,40)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (2, 37, 43), (2, 44, 42), (2, 38, 41), (2, 39, 40);

-- ============================================================
-- FECHA 3 — Miércoles 8 Abril 2026
-- ============================================================

-- PRINCIPIANTE R3: (1,6),(7,5),(8,4),(2,3)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (3, 1, 6), (3, 7, 5), (3, 8, 4), (3, 2, 3);

-- D GRUPO 1 R3: (9,25),(18,10),(26,19)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (3, 9, 25), (3, 18, 10), (3, 26, 19);

-- D GRUPO 2 R3: (12,17),(20,11),(21,16)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (3, 12, 17), (3, 20, 11), (3, 21, 16);

-- D GRUPO 3 R3: (15,14),(22,24),(23,13)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (3, 15, 14), (3, 22, 24), (3, 23, 13);

-- C- R3: (27,34),(35,33),(36,32),(28,31),(29,30)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (3, 27, 34), (3, 35, 33), (3, 36, 32), (3, 28, 31), (3, 29, 30);

-- C+ R3: (37,42),(43,41),(44,40),(38,39)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (3, 37, 42), (3, 43, 41), (3, 44, 40), (3, 38, 39);

-- ============================================================
-- FECHA 4 — Miércoles 15 Abril 2026
-- ============================================================

-- PRINCIPIANTE R4: (1,5),(6,4),(7,3),(8,2)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (4, 1, 5), (4, 6, 4), (4, 7, 3), (4, 8, 2);

-- D GRUPO 1 R4: (9,10),(25,19),(18,26)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (4, 9, 10), (4, 25, 19), (4, 18, 26);

-- D GRUPO 2 R4: (12,11),(17,16),(20,21)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (4, 12, 11), (4, 17, 16), (4, 20, 21);

-- D GRUPO 3 R4: (15,24),(14,13),(22,23)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (4, 15, 24), (4, 14, 13), (4, 22, 23);

-- C- R4: (27,33),(34,32),(35,31),(36,30),(28,29)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (4, 27, 33), (4, 34, 32), (4, 35, 31), (4, 36, 30), (4, 28, 29);

-- C+ R4: (37,41),(42,40),(43,39),(44,38)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (4, 37, 41), (4, 42, 40), (4, 43, 39), (4, 44, 38);

-- ============================================================
-- FECHA 5 — Miércoles 22 Abril 2026
-- ============================================================

-- PRINCIPIANTE R5: (1,4),(5,3),(6,2),(7,8)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (5, 1, 4), (5, 5, 3), (5, 6, 2), (5, 7, 8);

-- D GRUPO 1 R5: (9,19),(10,26),(25,18)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (5, 9, 19), (5, 10, 26), (5, 25, 18);

-- D GRUPO 2 R5: (12,16),(11,21),(17,20)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (5, 12, 16), (5, 11, 21), (5, 17, 20);

-- D GRUPO 3 R5: (15,13),(24,23),(14,22)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (5, 15, 13), (5, 24, 23), (5, 14, 22);

-- C- R5: (27,32),(33,31),(34,30),(35,29),(36,28)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (5, 27, 32), (5, 33, 31), (5, 34, 30), (5, 35, 29), (5, 36, 28);

-- C+ R5: (37,40),(41,39),(42,38),(43,44)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (5, 37, 40), (5, 41, 39), (5, 42, 38), (5, 43, 44);

-- ============================================================
-- FECHA 6 — Miércoles 29 Abril 2026
-- (INICIO COPA D — puntaje Copa desde esta fecha)
-- ============================================================

-- PRINCIPIANTE R6: (1,3),(4,2),(5,8),(6,7)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (6, 1, 3), (6, 4, 2), (6, 5, 8), (6, 6, 7);

-- COPA ORO R1: (9,14),(10,13),(11,12)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (6, 9, 14), (6, 10, 13), (6, 11, 12);

-- COPA PLATA 1 R1: (15,20),(16,19),(17,18)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (6, 15, 20), (6, 16, 19), (6, 17, 18);

-- COPA PLATA 2 R1: (21,26),(22,25),(23,24)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (6, 21, 26), (6, 22, 25), (6, 23, 24);

-- C- R6: (27,31),(32,30),(33,29),(34,28),(35,36)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (6, 27, 31), (6, 32, 30), (6, 33, 29), (6, 34, 28), (6, 35, 36);

-- C+ R6: (37,39),(40,38),(41,44),(42,43)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (6, 37, 39), (6, 40, 38), (6, 41, 44), (6, 42, 43);

-- ============================================================
-- FECHA 7 — Miércoles 6 Mayo 2026
-- ============================================================

-- PRINCIPIANTE R7: (1,2),(3,8),(4,7),(5,6)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (7, 1, 2), (7, 3, 8), (7, 4, 7), (7, 5, 6);

-- COPA ORO R2: (9,13),(14,12),(10,11)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (7, 9, 13), (7, 14, 12), (7, 10, 11);

-- COPA PLATA 1 R2: (15,19),(20,18),(16,17)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (7, 15, 19), (7, 20, 18), (7, 16, 17);

-- COPA PLATA 2 R2: (21,25),(26,24),(22,23)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (7, 21, 25), (7, 26, 24), (7, 22, 23);

-- C- R7: (27,30),(31,29),(32,28),(33,36),(34,35)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (7, 27, 30), (7, 31, 29), (7, 32, 28), (7, 33, 36), (7, 34, 35);

-- C+ R7: (37,38),(39,44),(40,43),(41,42)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (7, 37, 38), (7, 39, 44), (7, 40, 43), (7, 41, 42);

-- ============================================================
-- FECHA 8 — Miércoles 13 Mayo 2026
-- ============================================================

-- PRINCIPIANTE — segunda vuelta R1: (1,8),(2,7),(3,6),(4,5)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (8, 1, 8), (8, 2, 7), (8, 3, 6), (8, 4, 5);

-- COPA ORO R3: (9,12),(13,11),(14,10)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (8, 9, 12), (8, 13, 11), (8, 14, 10);

-- COPA PLATA 1 R3: (15,18),(19,17),(20,16)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (8, 15, 18), (8, 19, 17), (8, 20, 16);

-- COPA PLATA 2 R3: (21,24),(25,23),(26,22)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (8, 21, 24), (8, 25, 23), (8, 26, 22);

-- C- R8: (27,29),(30,28),(31,36),(32,35),(33,34)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (8, 27, 29), (8, 30, 28), (8, 31, 36), (8, 32, 35), (8, 33, 34);

-- ============================================================
-- FECHA 9 — Miércoles 27 Mayo 2026
-- ============================================================

-- PRINCIPIANTE — segunda vuelta R2
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (9, 1, 7), (9, 8, 6), (9, 2, 5), (9, 3, 4);

-- COPA ORO R4: (9,11),(12,10),(13,14)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (9, 9, 11), (9, 12, 10), (9, 13, 14);

-- COPA PLATA 1 R4: (15,17),(18,16),(19,20)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (9, 15, 17), (9, 18, 16), (9, 19, 20);

-- COPA PLATA 2 R4: (21,23),(24,22),(25,26)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (9, 21, 23), (9, 24, 22), (9, 25, 26);

-- C- R9: (27,28),(29,36),(30,35),(31,34),(32,33)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (9, 27, 28), (9, 29, 36), (9, 30, 35), (9, 31, 34), (9, 32, 33);

-- ============================================================
-- FECHA 10 — Miércoles 3 Junio 2026
-- ============================================================

-- PRINCIPIANTE — segunda vuelta R3
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (10, 1, 6), (10, 7, 5), (10, 8, 4), (10, 2, 3);

-- COPA ORO R5: (9,10),(11,14),(12,13)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (10, 9, 10), (10, 11, 14), (10, 12, 13);

-- COPA PLATA 1 R5: (15,16),(17,20),(18,19)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (10, 15, 16), (10, 17, 20), (10, 18, 19);

-- COPA PLATA 2 R5: (21,22),(23,26),(24,25)
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (10, 21, 22), (10, 23, 26), (10, 24, 25);

-- ============================================================
-- FECHA 11 — Miércoles 10 Junio 2026
-- (Semifinales o fechas extra para algunas categorías)
-- ============================================================

-- PRINCIPIANTE — segunda vuelta R4
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (11, 1, 5), (11, 6, 4), (11, 7, 3), (11, 8, 2);

-- ============================================================
-- FECHA 12 — Miércoles 17 Junio 2026
-- (Finales)
-- ============================================================

-- PRINCIPIANTE — segunda vuelta R5
insert into partidos (fecha_id, pareja1_id, pareja2_id) values
  (12, 1, 4), (12, 5, 3), (12, 6, 2), (12, 7, 8);
