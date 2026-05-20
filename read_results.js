const XLSX = require('xlsx')

const wb = XLSX.readFile('C:\\Users\\catal\\Downloads\\resultados_liga_mujeres.xlsx', { cellFormula: false })
const ws = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })

// Pareja DB lookup (id -> canonical name)
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

// Build flexible lookup: both orderings of surnames
const lookup = {}
for (const [idStr, nombre] of Object.entries(parejas)) {
  const id = parseInt(idStr)
  const parts = nombre.split(' - ')
  const a = parts[0].toLowerCase().trim()
  const b = parts[1].toLowerCase().trim()
  lookup[`${a}|${b}`] = id
  lookup[`${b}|${a}`] = id
}

// Extra aliases for variations in the Excel
const aliases = {
  "f.echeverría": "echeverría",
  "echeverría": "echeverría",
  "halley harris": "halley",
  "halley": "halley",
  "mena - halley harris": "mena - halley",
  "mena - halley": "mena - halley",
  "martiija": "martija",
  "silberberg - martiija": "silberberg - martija",
  "pérez de arce": "pérez de arce",
}

function normalizeName(n) {
  return n.toLowerCase()
    .replace(/\s+/g, ' ')
    .replace('martiija', 'martija')
    .replace('halley harris', 'halley')
    .replace('f.echeverría', 'f.echeverría') // keep for lookup
    .trim()
}

function findPareja(rawName) {
  const n = normalizeName(rawName)
  const parts = n.split(' - ')
  if (parts.length < 2) return null
  const a = parts[0].trim()
  const b = parts.slice(1).join(' - ').trim()

  // Try direct lookup
  if (lookup[`${a}|${b}`]) return lookup[`${a}|${b}`]

  // Try first word only matching (for "Echeverría - Echeverría" etc)
  // Find by scanning all
  for (const [key, id] of Object.entries(lookup)) {
    const [ka, kb] = key.split('|')
    // Match if first surname matches
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

// Parse all data rows
const dataRows = rows.filter(r => typeof r[0] === 'number')

// Check name resolution
const unmatched = []
const results = []

for (const row of dataRows) {
  const [id, fecha, div, p1name, , p2name, set1raw, set2raw, tbraw, inv] = row

  const p1id = findPareja(p1name)
  const p2id = findPareja(p2name)

  if (!p1id || !p2id) {
    unmatched.push({ id, fecha, p1name, p2name, p1id, p2id })
    continue
  }

  const [s1p1, s1p2] = parseScore(set1raw)
  const [s2p1, s2p2] = parseScore(set2raw)
  const [tbp1, tbp2] = parseScore(tbraw)

  const inverted = String(inv).toLowerCase().trim() === 's'

  results.push({
    fecha: parseInt(String(fecha).replace('Fecha ', '')),
    div: String(div),
    p1id: inverted ? p2id : p1id,
    p2id: inverted ? p1id : p2id,
    s1p1: inverted ? s1p2 : s1p1,
    s1p2: inverted ? s1p1 : s1p2,
    s2p1: inverted ? s2p2 : s2p1,
    s2p2: inverted ? s2p1 : s2p2,
    tbp1: inverted ? tbp2 : tbp1,
    tbp2: inverted ? tbp1 : tbp2,
  })
}

console.log(`Parsed: ${results.length} rows, Unmatched: ${unmatched.length}`)
if (unmatched.length > 0) {
  console.log('UNMATCHED:')
  unmatched.forEach(u => console.log(` ID ${u.id}: "${u.p1name}" (${u.p1id}) vs "${u.p2name}" (${u.p2id})`))
}

// Show Copa D grupo discrepancies
const copaRows = results.filter(r => ['Copa Oro','Copa Plata 1','Copa Plata 2'].includes(r.div))
const copaOroIds = [...new Set(copaRows.filter(r=>r.div==='Copa Oro').flatMap(r=>[r.p1id,r.p2id]))]
const copaPlata1Ids = [...new Set(copaRows.filter(r=>r.div==='Copa Plata 1').flatMap(r=>[r.p1id,r.p2id]))]
const copaPlata2Ids = [...new Set(copaRows.filter(r=>r.div==='Copa Plata 2').flatMap(r=>[r.p1id,r.p2id]))]
console.log('\nCopa Oro IDs:', copaOroIds.sort((a,b)=>a-b))
console.log('Copa Plata 1 IDs:', copaPlata1Ids.sort((a,b)=>a-b))
console.log('Copa Plata 2 IDs:', copaPlata2Ids.sort((a,b)=>a-b))
