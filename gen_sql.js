const XLSX = require('xlsx')
const fs = require('fs')

const wb = XLSX.readFile('C:\\Users\\catal\\Downloads\\resultados_liga_mujeres.xlsx', { cellFormula: false })
const ws = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

const parejas = {
  1:"Echeverría - F.Echeverría",2:"Calvo - Sotomayor",3:"Parentini - Guldman",
  4:"Mena - Halley",5:"Kraus - Montes",6:"Valdivieso - Bulnes",
  7:"Aguirre - Vergara",8:"Berríos - Cifuentes",
  9:"Spoerer - Uriarte",10:"Constenla - Muñoz",11:"Benko - Court",
  12:"Bauer - Focke",13:"Zuloaga - Covarrubias",14:"Riesco - Illanes",
  15:"Hurtado - Sequenzia",16:"Barros - Castro",17:"Yavar - Subercaseaux",
  18:"Triffiletti - Pérez de Arce",19:"Papic - Tagle",20:"Izquierdo - Vega",
  21:"Del Campo - Stuven",22:"Weiss - Rodríguez",23:"Yunge - Prieto",
  24:"Aubert - Fernández",25:"Sepúlveda - Pasarón",26:"Vial - Corbetto",
  27:"Rojas - Herrera",28:"Castro - Gil",29:"Laissle - Hagelin",
  30:"Swett - Guerrero",31:"Mendia - Bier",32:"Philippi - Escala",
  33:"Álvarez - Valderrama",34:"Bay - Alarja",35:"Pérez - Fuenzalida",
  36:"Cooper - Camposano",
  37:"Miquel - Aubert",38:"Maturana - Hevia",39:"Cuencio - Nieva",
  40:"Estartus - Ríos",41:"Silberberg - Martija",42:"Ledesma - Figueroa",
  43:"Lladser - Barrientos",44:"Lobel - Troncoso"
}

const lookup = {}
for (const [idStr, nombre] of Object.entries(parejas)) {
  const id = parseInt(idStr)
  const parts = nombre.split(' - ')
  const a = parts[0].toLowerCase().trim()
  const b = parts[1].toLowerCase().trim()
  lookup[`${a}|${b}`] = id
  lookup[`${b}|${a}`] = id
}

function normName(n) {
  return n.toLowerCase().replace(/\s+/g, ' ')
    .replace('martiija', 'martija')
    .replace('halley harris', 'halley')
    .trim()
}

function findPareja(rawName) {
  const n = normName(rawName)
  const parts = n.split(' - ')
  if (parts.length < 2) return null
  const a = parts[0].trim()
  const b = parts.slice(1).join(' - ').trim()

  if (a === b && a.includes('echeverría')) return 1
  if (lookup[`${a}|${b}`]) return lookup[`${a}|${b}`]

  for (const [key, id] of Object.entries(lookup)) {
    const [ka, kb] = key.split('|')
    if ((ka.startsWith(a.split(' ')[0]) && kb.startsWith(b.split(' ')[0])) ||
        (kb.startsWith(a.split(' ')[0]) && ka.startsWith(b.split(' ')[0]))) {
      return id
    }
  }
  return null
}

function parseScore(s) {
  if (s === '' || s === null || s === undefined) return [null, null]
  if (typeof s === 'number') return s === 0 ? [null, null] : [s, null]
  const cleaned = String(s).replace(/\s+/g, '').replace(',', '.')
  const match = cleaned.match(/^(\d+)-(\d+)$/)
  if (!match) return [null, null]
  return [parseInt(match[1]), parseInt(match[2])]
}

function sqlStr(v) { return v === null || v === '' ? 'NULL' : `'${String(v).replace(/'/g, "''")}'` }
function sqlVal(v) { return v === null ? 'NULL' : v }

const dataRows = rows.filter(r => typeof r[0] === 'number')
const results = []

for (const row of dataRows) {
  // Columns: ID | Fecha | División | Pareja1 | vs | Pareja2 | Set1 | Set2 | TB | Inv | Hora | Lugar | Cancha
  const [id, fecha, div, p1name, , p2name, set1raw, set2raw, tbraw, inv, horaRaw, lugarRaw, canchaRaw] = row
  let p1id = findPareja(p1name)
  let p2id = findPareja(p2name)

  if (!p1id || !p2id) {
    console.error(`UNMATCHED ID ${id}: "${p1name}" vs "${p2name}"`)
    continue
  }

  let [s1p1, s1p2] = parseScore(set1raw)
  let [s2p1, s2p2] = parseScore(set2raw)
  let [tbp1, tbp2] = parseScore(tbraw)

  const inverted = String(inv).toLowerCase().trim() === 's'
  if (inverted) {
    ;[p1id, p2id] = [p2id, p1id]
    ;[s1p1, s1p2] = [s1p2, s1p1]
    ;[s2p1, s2p2] = [s2p2, s2p1]
    ;[tbp1, tbp2] = [tbp2, tbp1]
  }

  const isWO = s1p1 === 0 && s1p2 === 0 && s2p1 === 0 && s2p2 === 0
  const jugado = !isWO

  const hora   = horaRaw   ? String(horaRaw).trim()   : null
  const lugar  = lugarRaw  ? String(lugarRaw).trim()  : null
  const cancha = canchaRaw ? String(canchaRaw).trim() : null

  results.push({
    fechaNum: parseInt(String(fecha).replace('Fecha ', '')),
    p1id, p2id, s1p1, s1p2, s2p1, s2p2, tbp1, tbp2, jugado,
    hora, lugar, cancha
  })
}

console.log(`Parsed ${results.length} matches (${results.filter(r=>r.jugado).length} played)`)

// Fechas present in Excel
const fechasEnExcel = [...new Set(results.map(r => r.fechaNum))].sort((a,b)=>a-b)
console.log('Fechas en Excel:', fechasEnExcel.join(', '))

// ─── Generate SQL ───────────────────────────────────────────────

let sql = `-- Liga Pádel Everest Mujeres — Sincronización desde Excel
-- Generado automáticamente
-- ${new Date().toISOString()}
-- Fechas incluidas: ${fechasEnExcel.join(', ')}

-- ============================================================
-- 1) Eliminar partidos de las fechas presentes en el Excel
--    (los de fechas futuras no se tocan)
-- ============================================================
DELETE FROM partidos WHERE fecha_id IN (${fechasEnExcel.join(',')});

-- ============================================================
-- 2) Insertar partidos desde Excel (con hora/lugar/cancha)
-- ============================================================
`

// Group by fecha
const byFecha = {}
for (const r of results) {
  if (!byFecha[r.fechaNum]) byFecha[r.fechaNum] = []
  byFecha[r.fechaNum].push(r)
}

for (const fecha of Object.keys(byFecha).sort((a,b)=>a-b)) {
  sql += `\n-- Fecha ${fecha}\n`
  sql += `INSERT INTO partidos (fecha_id, pareja1_id, pareja2_id, set1_p1, set1_p2, set2_p1, set2_p2, tb_p1, tb_p2, jugado, hora, lugar, cancha) VALUES\n`
  const lines = byFecha[fecha].map(r =>
    `  (${fecha}, ${r.p1id}, ${r.p2id}, ${sqlVal(r.s1p1)}, ${sqlVal(r.s1p2)}, ${sqlVal(r.s2p1)}, ${sqlVal(r.s2p2)}, ${sqlVal(r.tbp1)}, ${sqlVal(r.tbp2)}, ${r.jugado}, ${sqlStr(r.hora)}, ${sqlStr(r.lugar)}, ${sqlStr(r.cancha)})`
  )
  sql += lines.join(',\n') + ';\n'
}

fs.writeFileSync('C:\\Users\\catal\\Downloads\\cargar_resultados.sql', sql, 'utf8')
console.log('SQL guardado en Downloads/cargar_resultados.sql')
