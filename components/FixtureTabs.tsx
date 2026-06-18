'use client'

import { useState } from 'react'
import PartidoCard from './PartidoCard'
import { Partido, Fecha, Grupo, PosicionGrupo, getColorGrupo } from '@/lib/types'
import { calcularPuntos, calcularDifGames } from '@/lib/calculos'

const GRUPOS: { key: Grupo; label: string }[] = [
  { key: 'principiante',   label: 'Principiante' },
  { key: 'd_copa_oro',     label: 'D — Copa Oro' },
  { key: 'd_copa_plata_1', label: 'D — Copa Plata 1' },
  { key: 'd_copa_plata_2', label: 'D — Copa Plata 2' },
  { key: 'c_menos',        label: 'C−' },
  { key: 'c_mas',          label: 'C+' },
]

interface Props {
  fechas: Fecha[]
  partidos: Partido[]
  proximaId?: number | null
  bracketFechaId?: number
  finalsFechaId?: number
  posOro?: PosicionGrupo[]
  posPlata1?: PosicionGrupo[]
  posPlata2?: PosicionGrupo[]
}

type Standing = { id: number; nombre: string; pts: number; dif: number }
type MatchResult = { winnerId: number; loserId: number; winnerName: string; loserName: string }

const formatTabDate = (fechaStr: string) => {
  const [, mes, dia] = fechaStr.split('-')
  return `${dia}.${mes}`
}

function getStandings(
  partidos: Partido[],
  grupo: Grupo,
  excludeFechaIds?: number | number[]
): Standing[] {
  const excludeSet = new Set<number>(
    excludeFechaIds === undefined ? [] :
    Array.isArray(excludeFechaIds) ? excludeFechaIds : [excludeFechaIds]
  )
  const stats: Record<number, { nombre: string; pts: number; dif: number }> = {}

  for (const p of partidos) {
    if (!p.jugado || p.set1_p1 === null) continue
    if (excludeSet.has(p.fecha_id)) continue
    const totalGames = (p.set1_p1 ?? 0) + (p.set1_p2 ?? 0) + (p.set2_p1 ?? 0) + (p.set2_p2 ?? 0)
    if (totalGames === 0) continue

    const g1 = p.pareja1?.grupo === grupo
    const g2 = p.pareja2?.grupo === grupo
    if (!g1 && !g2) continue

    const pts = calcularPuntos(p)
    const dif = calcularDifGames(p)

    if (g1) {
      if (!stats[p.pareja1_id]) stats[p.pareja1_id] = { nombre: p.pareja1?.nombre ?? `P${p.pareja1_id}`, pts: 0, dif: 0 }
      stats[p.pareja1_id].pts += pts.p1
      stats[p.pareja1_id].dif += dif.p1
    }
    if (g2) {
      if (!stats[p.pareja2_id]) stats[p.pareja2_id] = { nombre: p.pareja2?.nombre ?? `P${p.pareja2_id}`, pts: 0, dif: 0 }
      stats[p.pareja2_id].pts += pts.p2
      stats[p.pareja2_id].dif += dif.p2
    }
  }

  return Object.entries(stats)
    .map(([id, s]) => ({ id: Number(id), ...s }))
    .sort((a, b) => b.pts - a.pts || b.dif - a.dif)
}

function slot(st: Standing[], pos: number): string {
  return st[pos - 1]?.nombre ?? `${pos}° del grupo`
}

function getMatchResult(
  partidos: Partido[],
  id1: number | undefined,
  id2: number | undefined,
  fechaId: number | undefined
): MatchResult | null {
  if (!id1 || !id2 || !fechaId) return null
  const p = partidos.find((p) =>
    p.fecha_id === fechaId &&
    ((p.pareja1_id === id1 && p.pareja2_id === id2) ||
     (p.pareja1_id === id2 && p.pareja2_id === id1))
  )
  if (!p?.jugado || p.set1_p1 === null) return null
  const pts = calcularPuntos(p)
  const p1Wins = pts.p1 > pts.p2
  return {
    winnerId:   p1Wins ? p.pareja1_id : p.pareja2_id,
    loserId:    p1Wins ? p.pareja2_id : p.pareja1_id,
    winnerName: (p1Wins ? p.pareja1?.nombre : p.pareja2?.nombre) ?? '',
    loserName:  (p1Wins ? p.pareja2?.nombre : p.pareja1?.nombre) ?? '',
  }
}

function MatchRow({ label, a, b, labelColor, hora, lugar, cancha, porDefinir }: {
  label: string; a: string; b: string; labelColor?: string
  hora?: string; lugar?: string; cancha?: string; porDefinir?: boolean
}) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="shrink-0 w-16 text-center">
        {hora ? (
          <>
            <div className="text-xs font-bold" style={{ color: labelColor ?? '#6b7280' }}>{hora}</div>
            <div className="text-[10px] text-gray-400">{lugar} C{cancha}</div>
          </>
        ) : porDefinir ? (
          <div className="text-[10px] text-gray-400 italic">Por definir</div>
        ) : (
          <span className="text-[10px] font-bold" style={{ color: labelColor ?? '#6b7280' }}>{label}</span>
        )}
      </div>
      <span className="flex-1 min-w-0 text-xs font-medium text-gray-800 truncate">{a}</span>
      <span className="text-xs text-gray-300 shrink-0">vs</span>
      <span className="flex-1 min-w-0 text-xs font-medium text-gray-800 truncate text-right">{b}</span>
    </div>
  )
}

const D_CATS = [
  { key: 'd_copa_oro' as const, label: 'D — Copa Oro',
    sf1:  { hora: '18:00', lugar: 'PLT',     cancha: '1' },
    sf2:  { hora: '18:00', lugar: 'PLT',     cancha: '2' },
    final:{ hora: '19:00', lugar: 'PLT',     cancha: '2' },
    p56:  { hora: '18:30', lugar: 'Everest', cancha: '1' } },
]

export default function FixtureTabs({ fechas, partidos, proximaId, bracketFechaId, finalsFechaId, posOro, posPlata1, posPlata2 }: Props) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<number>(
    proximaId ?? fechas[0]?.id ?? 0
  )

  const fecha = fechas.find((f) => f.id === fechaSeleccionada)
  const partidosFecha = partidos.filter((p) => p.fecha_id === fechaSeleccionada)
  const esBracket = bracketFechaId !== undefined && fechaSeleccionada === bracketFechaId
  const esFinals  = finalsFechaId  !== undefined && fechaSeleccionada === finalsFechaId

  // ── Standings para el bracket (excluye bracket fecha) ────────────────
  const stPrincipiante = esBracket ? getStandings(partidos, 'principiante', bracketFechaId) : []
  const stCMenos       = esBracket ? getStandings(partidos, 'c_menos',      bracketFechaId) : []

  // ── Standings para finales (excluye bracket + finales fechas) ────────
  const excludeForFinals = [bracketFechaId, finalsFechaId].filter((x): x is number => x !== undefined)
  const stPrincFin = esFinals ? getStandings(partidos, 'principiante', excludeForFinals) : []
  const stCMFin    = esFinals ? getStandings(partidos, 'c_menos',      excludeForFinals) : []

  // ── D standings desde servidor (misma lógica que posiciones) ─────────
  const stPlata1 = (posPlata1 ?? []).map((p) => ({ id: p.pareja.id, nombre: p.pareja.nombre, pts: p.pts, dif: p.dif }))
  const stPlata2 = (posPlata2 ?? []).map((p) => ({ id: p.pareja.id, nombre: p.pareja.nombre, pts: p.pts, dif: p.dif }))
  const plataSF1r  = getMatchResult(partidos, stPlata1[0]?.id, stPlata2[1]?.id, finalsFechaId)
  const plataSF2r  = getMatchResult(partidos, stPlata2[0]?.id, stPlata1[1]?.id, finalsFechaId)
  const plataFinalA = plataSF1r?.winnerName || 'Gan. SF1'
  const plataFinalB = plataSF2r?.winnerName || 'Gan. SF2'

  // ── C− SF/Final: depende de resultados de QF (bracketFechaId) ─────────
  const cmCF1r = getMatchResult(partidos, stCMFin[0]?.id, stCMFin[7]?.id, bracketFechaId)
  const cmCF2r = getMatchResult(partidos, stCMFin[1]?.id, stCMFin[6]?.id, bracketFechaId)
  const cmCF3r = getMatchResult(partidos, stCMFin[2]?.id, stCMFin[5]?.id, bracketFechaId)
  const cmCF4r = getMatchResult(partidos, stCMFin[3]?.id, stCMFin[4]?.id, bracketFechaId)
  const cmSF1a   = cmCF1r?.winnerName || 'Gan. CF1'
  const cmSF1b   = cmCF4r?.winnerName || 'Gan. CF4'
  const cmSF2a   = cmCF2r?.winnerName || 'Gan. CF2'
  const cmSF2b   = cmCF3r?.winnerName || 'Gan. CF3'
  const cm5a     = cmCF1r?.loserName  || 'Perd. CF1'
  const cm5b     = cmCF4r?.loserName  || 'Perd. CF4'
  const cm7a     = cmCF2r?.loserName  || 'Perd. CF2'
  const cm7b     = cmCF3r?.loserName  || 'Perd. CF3'
  const cmSF1r   = getMatchResult(partidos, cmCF1r?.winnerId, cmCF4r?.winnerId, finalsFechaId)
  const cmSF2r   = getMatchResult(partidos, cmCF2r?.winnerId, cmCF3r?.winnerId, finalsFechaId)
  const cmFinalA = cmSF1r?.winnerName || 'Gan. SF1'
  const cmFinalB = cmSF2r?.winnerName || 'Gan. SF2'

  const mkResult = (p: Partido | undefined): MatchResult | null => {
    if (!p?.jugado || p.set1_p1 === null) return null
    const pts = calcularPuntos(p)
    const p1w = pts.p1 > pts.p2
    return {
      winnerId:   p1w ? p.pareja1_id : p.pareja2_id,
      loserId:    p1w ? p.pareja2_id : p.pareja1_id,
      winnerName: (p1w ? p.pareja1?.nombre : p.pareja2?.nombre) || '',
      loserName:  (p1w ? p.pareja2?.nombre : p.pareja1?.nombre) || '',
    }
  }

  // ── Principiante: todos los partidos del bracket ──────────────────────
  const allPrincIds = new Set(stPrincFin.map((s) => s.id))
  const sfSeedIds   = new Set(
    [stPrincFin[0]?.id, stPrincFin[1]?.id, stPrincFin[2]?.id, stPrincFin[3]?.id]
      .filter((x): x is number => x !== undefined)
  )
  const allPrincBracket = (esFinals && bracketFechaId) ? partidos.filter((p) =>
    p.fecha_id === bracketFechaId &&
    (allPrincIds.has(p.pareja1_id) || allPrincIds.has(p.pareja2_id))
  ) : []
  // SF = partidos donde ambos equipos son top-4 (semis). No-SF = P3/P4.
  const pSFPartidos = allPrincBracket.filter((p) =>
    sfSeedIds.has(p.pareja1_id) && sfSeedIds.has(p.pareja2_id)
  )
  const pNonSF = allPrincBracket.filter((p) =>
    !(sfSeedIds.has(p.pareja1_id) && sfSeedIds.has(p.pareja2_id))
  )
  const sf1r = mkResult(pSFPartidos[0])
  const sf2r = mkResult(pSFPartidos[1])
  const p3r  = mkResult(pNonSF[0])
  const p4r  = mkResult(pNonSF[1])

  const pFinalA = sf1r?.winnerName || 'Gan. SF1'
  const pFinalB = sf2r?.winnerName || 'Gan. SF2'
  const p34a    = sf1r?.loserName  || 'Perd. SF1'
  const p34b    = sf2r?.loserName  || 'Perd. SF2'
  const p56a    = p3r?.winnerName  || 'Gan. P3'
  const p56b    = p4r?.winnerName  || 'Gan. P4'
  const p78a    = p3r?.loserName   || 'Perd. P3'
  const p78b    = p4r?.loserName   || 'Perd. P4'


  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {fechas.map((f) => {
          const activa    = f.id === fechaSeleccionada
          const esProxima = f.id === proximaId
          return (
            <button
              key={f.id}
              onClick={() => setFechaSeleccionada(f.id)}
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                activa
                  ? 'bg-[#6d28d9] text-white'
                  : esProxima
                  ? 'bg-purple-100 text-[#6d28d9]'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {f.label} ({formatTabDate(f.fecha)})
            </button>
          )
        })}
      </div>

      {/* Fecha formateada */}
      {fecha && (
        <p className="text-sm text-gray-500 capitalize mb-3">
          {new Date(fecha.fecha + 'T12:00:00').toLocaleDateString('es-CL', {
            weekday: 'long', day: 'numeric', month: 'long',
          })}
        </p>
      )}

      {fecha?.label.toLowerCase().includes('suspendida') ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
          <span className="text-4xl mb-3">🌧️</span>
          <p className="font-semibold text-gray-500">Fecha suspendida por lluvia</p>
          <p className="text-xs mt-1">Los partidos fueron reagendados para el 17.06</p>
        </div>

      ) : esBracket ? (
        /* ── Bracket Semifinales / Cuartos de Final ─────────────────────── */
        <div className="space-y-4">
          <p className="text-xs text-gray-400 -mt-1">Se actualiza según posiciones actuales</p>

          {/* Principiante: Semifinales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-[#6d28d9] text-white">
              <h3 className="font-bold text-sm uppercase tracking-wider">Principiante — Semifinales</h3>
            </div>
            <div className="flex">
              <div className="flex-1 min-w-0 divide-y divide-gray-100">
                <div className="px-3 py-1 divide-y divide-gray-50">
                  {[
                    { a: slot(stPrincipiante, 1), b: slot(stPrincipiante, 4), hora: '18:30', lugar: 'Everest', cancha: '1' },
                    { a: slot(stPrincipiante, 2), b: slot(stPrincipiante, 3), hora: '19:30', lugar: 'Everest', cancha: '1' },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5">
                      <div className="shrink-0 text-center w-16">
                        <div className="text-xs font-bold text-[#6d28d9]">{c.hora}</div>
                        <div className="text-[10px] text-gray-400">{c.lugar} C{c.cancha}</div>
                      </div>
                      <span className="flex-1 min-w-0 text-xs font-medium text-gray-800 truncate">{c.a}</span>
                      <span className="text-xs text-gray-300 shrink-0">vs</span>
                      <span className="flex-1 min-w-0 text-xs font-medium text-gray-800 truncate text-right">{c.b}</span>
                    </div>
                  ))}
                </div>
                <div className="px-3 py-1 divide-y divide-gray-50">
                  {[
                    { a: slot(stPrincipiante, 5), b: slot(stPrincipiante, 8), hora: '18:30', lugar: 'Everest', cancha: '2' },
                    { a: slot(stPrincipiante, 6), b: slot(stPrincipiante, 7), hora: '19:30', lugar: 'Everest', cancha: '2' },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5">
                      <div className="shrink-0 text-center w-16">
                        <div className="text-xs font-bold text-[#6d28d9]">{c.hora}</div>
                        <div className="text-[10px] text-gray-400">{c.lugar} C{c.cancha}</div>
                      </div>
                      <span className="flex-1 min-w-0 text-xs font-medium text-gray-800 truncate">{c.a}</span>
                      <span className="text-xs text-gray-300 shrink-0">vs</span>
                      <span className="flex-1 min-w-0 text-xs font-medium text-gray-800 truncate text-right">{c.b}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col shrink-0 w-[4.5rem]">
                <div className="flex-1 bg-green-600 flex items-center justify-center px-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white text-center leading-tight">SEMI<br/>FINALES</span>
                </div>
                <div className="flex-1 bg-gray-400 flex items-center justify-center px-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white text-center leading-tight">DEMÁS<br/>LUGARES</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categoría D */}
          {GRUPOS.filter((g) => g.key.startsWith('d_')).map((g) => {
            const gPartidos = partidosFecha.filter((p) => p.pareja1?.grupo === g.key)
            if (gPartidos.length === 0) return null
            const color = getColorGrupo(g.key)
            return (
              <div key={g.key}>
                <div
                  style={{ borderLeftColor: color.header, backgroundColor: color.bg }}
                  className="border-l-4 px-3 py-1 rounded-r-lg mb-1.5"
                >
                  <span style={{ color: color.header }} className="text-xs font-bold uppercase tracking-wider">
                    {g.label}
                  </span>
                </div>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {gPartidos.map((p) => (
                    <PartidoCard key={p.id} partido={p} grupo={g.key} />
                  ))}
                </div>
              </div>
            )
          })}

          {/* C−: Cuartos de Final */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-[#156082] text-white">
              <h3 className="font-bold text-sm uppercase tracking-wider">C− — Cuartos de Final</h3>
            </div>
            <div className="border-b border-gray-100">
              <div className="px-3 py-1 bg-green-600">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">Cuartos de Final</span>
              </div>
              <div className="px-3 py-1 divide-y divide-gray-50">
                {[
                  { a: slot(stCMenos, 1), b: slot(stCMenos, 8), hora: '18:00', lugar: 'PLT', cancha: '5' },
                  { a: slot(stCMenos, 2), b: slot(stCMenos, 7), hora: '18:00', lugar: 'PLT', cancha: '6' },
                  { a: slot(stCMenos, 3), b: slot(stCMenos, 6), hora: '19:00', lugar: 'PLT', cancha: '5' },
                  { a: slot(stCMenos, 4), b: slot(stCMenos, 5), hora: '19:00', lugar: 'PLT', cancha: '6' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5">
                    <div className="shrink-0 text-center w-16">
                      <div className="text-xs font-bold text-[#156082]">{c.hora}</div>
                      <div className="text-[10px] text-gray-400">{c.lugar} C{c.cancha}</div>
                    </div>
                    <span className="flex-1 min-w-0 text-xs font-medium text-gray-800 truncate">{c.a}</span>
                    <span className="text-xs text-gray-300 shrink-0">vs</span>
                    <span className="flex-1 min-w-0 text-xs font-medium text-gray-800 truncate text-right">{c.b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="px-3 py-1 bg-gray-400">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white">9° / 10° Lugar</span>
              </div>
              <div className="px-3 py-1">
                <div className="flex items-center gap-2 py-1.5">
                  <div className="shrink-0 text-center w-16">
                    <div className="text-xs font-bold text-[#156082]">20:00</div>
                    <div className="text-[10px] text-gray-400">PLT C6</div>
                  </div>
                  <span className="flex-1 min-w-0 text-xs font-medium text-gray-800 truncate">{slot(stCMenos, 9)}</span>
                  <span className="text-xs text-gray-300 shrink-0">vs</span>
                  <span className="flex-1 min-w-0 text-xs font-medium text-gray-800 truncate text-right">{slot(stCMenos, 10)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* C+ en bracket */}
          {(() => {
            const gPartidos = partidosFecha.filter((p) => p.pareja1?.grupo === 'c_mas')
            if (gPartidos.length === 0) return null
            const color = getColorGrupo('c_mas')
            return (
              <div>
                <div
                  style={{ borderLeftColor: color.header, backgroundColor: color.bg }}
                  className="border-l-4 px-3 py-1 rounded-r-lg mb-1.5"
                >
                  <span style={{ color: color.header }} className="text-xs font-bold uppercase tracking-wider">C+</span>
                </div>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {gPartidos.map((p) => (
                    <PartidoCard key={p.id} partido={p} grupo="c_mas" />
                  ))}
                </div>
              </div>
            )
          })()}
        </div>

      ) : esFinals ? (
        /* ── Finales 08.07 ───────────────────────────────────────────────── */
        <div className="space-y-4">
          <p className="text-xs text-gray-400 -mt-1">Se actualiza según resultados anteriores</p>

          {/* Principiante */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-[#6d28d9] text-white">
              <h3 className="font-bold text-sm uppercase tracking-wider">Principiante — Finales</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div>
                <div className="px-3 py-1 bg-yellow-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">Final</span>
                </div>
                <div className="px-3 py-1">
                  <MatchRow label="1°/2°" a={pFinalA} b={pFinalB} labelColor="#6d28d9" hora="19:00" lugar="PLT" cancha="1" />
                </div>
              </div>
              <div>
                <div className="px-3 py-1 bg-gray-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">3° / 4° Lugar</span>
                </div>
                <div className="px-3 py-1">
                  <MatchRow label="3°/4°" a={p34a} b={p34b} hora="19:00" lugar="PLT" cancha="8" />
                </div>
              </div>
              <div>
                <div className="px-3 py-1 bg-gray-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">Demás Lugares</span>
                </div>
                <div className="px-3 py-1 divide-y divide-gray-50">
                  <MatchRow label="5°/6°" a={p56a} b={p56b} hora="19:00" lugar="PLT" cancha="9" />
                  <MatchRow label="7°/8°" a={p78a} b={p78b} hora="19:00" lugar="PLT" cancha="10" />
                </div>
              </div>
            </div>
          </div>

          {/* D categories */}
          {D_CATS.map(({ key, label, sf1, sf2, final: fin, p56 }) => {
            const color = getColorGrupo(key)
            const stD = key === 'd_copa_oro'
              ? (posOro ?? []).map((p) => ({ id: p.pareja.id, nombre: p.pareja.nombre, pts: p.pts, dif: p.dif }))
              : getStandings(partidos, key, finalsFechaId)
            const dSF1r = getMatchResult(partidos, stD[0]?.id, stD[3]?.id, finalsFechaId)
            const dSF2r = getMatchResult(partidos, stD[1]?.id, stD[2]?.id, finalsFechaId)
            const dSF1a   = stD[0]?.nombre || '1° lugar'
            const dSF1b   = stD[3]?.nombre || '4° lugar'
            const dSF2a   = stD[1]?.nombre || '2° lugar'
            const dSF2b   = stD[2]?.nombre || '3° lugar'
            const d56a    = stD[4]?.nombre || '5° lugar'
            const d56b    = stD[5]?.nombre || '6° lugar'
            const dFinalA = dSF1r?.winnerName || 'Gan. SF1'
            const dFinalB = dSF2r?.winnerName || 'Gan. SF2'
            return (
              <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-2.5 border-l-4" style={{ borderLeftColor: color.header, backgroundColor: color.bg }}>
                  <span style={{ color: color.header }} className="text-xs font-bold uppercase tracking-wider">{label}</span>
                </div>
                <div className="divide-y divide-gray-100">
                  <div>
                    <div className="px-3 py-1 bg-green-600">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">Semifinales</span>
                    </div>
                    <div className="px-3 py-1 divide-y divide-gray-50">
                      <MatchRow label="SF1" a={dSF1a} b={dSF1b} labelColor={color.header} hora={sf1.hora} lugar={sf1.lugar} cancha={sf1.cancha} />
                      <MatchRow label="SF2" a={dSF2a} b={dSF2b} labelColor={color.header} hora={sf2.hora} lugar={sf2.lugar} cancha={sf2.cancha} />
                    </div>
                  </div>
                  <div>
                    <div className="px-3 py-1 bg-yellow-500">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">Final</span>
                    </div>
                    <div className="px-3 py-1">
                      <MatchRow label="1°/2°" a={dFinalA} b={dFinalB} labelColor={color.header} hora={fin.hora} lugar={fin.lugar} cancha={fin.cancha} />
                    </div>
                  </div>
                  <div>
                    <div className="px-3 py-1 bg-gray-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">5° / 6° Lugar</span>
                    </div>
                    <div className="px-3 py-1">
                      <MatchRow label="5°/6°" a={d56a} b={d56b} hora={p56.hora} lugar={p56.lugar} cancha={p56.cancha} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* D Copa Plata unificada */}
          {(() => {
            const color = getColorGrupo('d_copa_plata_1')
            const sf1a = stPlata1[0]?.nombre || '1° Plata 1'
            const sf1b = stPlata2[1]?.nombre || '2° Plata 2'
            const sf2a = stPlata2[0]?.nombre || '1° Plata 2'
            const sf2b = stPlata1[1]?.nombre || '2° Plata 1'
            const rows = [3, 4, 5, 6].map((pos) => ({
              label: `${pos}°`,
              a: stPlata1[pos - 1]?.nombre || `${pos}° Plata 1`,
              b: stPlata2[pos - 1]?.nombre || `${pos}° Plata 2`,
            }))
            return (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-2.5 border-l-4" style={{ borderLeftColor: color.header, backgroundColor: color.bg }}>
                  <span style={{ color: color.header }} className="text-xs font-bold uppercase tracking-wider">D — Copa Plata</span>
                </div>
                <div className="divide-y divide-gray-100">
                  <div>
                    <div className="px-3 py-1 bg-green-600">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">Semifinales</span>
                    </div>
                    <div className="px-3 py-1 divide-y divide-gray-50">
                      <MatchRow label="SF1" a={sf1a} b={sf1b} labelColor={color.header} hora="18:00" lugar="PLT" cancha="3" />
                      <MatchRow label="SF2" a={sf2a} b={sf2b} labelColor={color.header} hora="18:00" lugar="PLT" cancha="4" />
                    </div>
                  </div>
                  <div>
                    <div className="px-3 py-1 bg-yellow-500">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">Final</span>
                    </div>
                    <div className="px-3 py-1">
                      <MatchRow label="1°/2°" a={plataFinalA} b={plataFinalB} labelColor={color.header} hora="19:00" lugar="PLT" cancha="3" />
                    </div>
                  </div>
                  <div>
                    <div className="px-3 py-1 bg-gray-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">Por Posición</span>
                    </div>
                    <div className="px-3 py-1 divide-y divide-gray-50">
                      {rows.map((r) => (
                        <MatchRow key={r.label} label={r.label} a={r.a} b={r.b} porDefinir />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* C− */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-[#156082] text-white">
              <h3 className="font-bold text-sm uppercase tracking-wider">C− — Semifinales y Final</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div>
                <div className="px-3 py-1 bg-green-600">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">Semifinales</span>
                </div>
                <div className="px-3 py-1 divide-y divide-gray-50">
                  <MatchRow label="SF1" a={cmSF1a} b={cmSF1b} labelColor="#156082" hora="18:00" lugar="PLT" cancha="7" />
                  <MatchRow label="SF2" a={cmSF2a} b={cmSF2b} labelColor="#156082" hora="18:00" lugar="PLT" cancha="8" />
                </div>
              </div>
              <div>
                <div className="px-3 py-1 bg-yellow-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">Final</span>
                </div>
                <div className="px-3 py-1">
                  <MatchRow label="1°/2°" a={cmFinalA} b={cmFinalB} labelColor="#156082" hora="19:00" lugar="PLT" cancha="5" />
                </div>
              </div>
              <div>
                <div className="px-3 py-1 bg-gray-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white">Demás Lugares</span>
                </div>
                <div className="px-3 py-1 divide-y divide-gray-50">
                  <MatchRow label="5°/6°"    a={cm5a} b={cm5b} porDefinir />
                  <MatchRow label="7°/8°"   a={cm7a} b={cm7b} hora="19:30" lugar="Everest" cancha="2" />
                  <MatchRow label="Amistoso" a="9° C−" b="10° C−" porDefinir />
                </div>
              </div>
            </div>
          </div>

          {/* C+ (partidos reales de DB) */}
          {(() => {
            const gPartidos = partidosFecha.filter((p) => p.pareja1?.grupo === 'c_mas')
            if (gPartidos.length === 0) return null
            const color = getColorGrupo('c_mas')
            return (
              <div>
                <div
                  style={{ borderLeftColor: color.header, backgroundColor: color.bg }}
                  className="border-l-4 px-3 py-1 rounded-r-lg mb-1.5"
                >
                  <span style={{ color: color.header }} className="text-xs font-bold uppercase tracking-wider">C+</span>
                </div>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {gPartidos.map((p) => (
                    <PartidoCard key={p.id} partido={p} grupo="c_mas" />
                  ))}
                </div>
              </div>
            )
          })()}
        </div>

      ) : (
        /* ── Partidos normales ──────────────────────────────────────────── */
        <div>
          {GRUPOS.map((g) => {
            const gPartidos = partidosFecha.filter((p) => p.pareja1?.grupo === g.key)
            if (gPartidos.length === 0) return null
            const color = getColorGrupo(g.key)
            return (
              <div key={g.key} className="mb-4">
                <div
                  style={{ borderLeftColor: color.header, backgroundColor: color.bg }}
                  className="border-l-4 px-3 py-1 rounded-r-lg mb-1.5"
                >
                  <span style={{ color: color.header }} className="text-xs font-bold uppercase tracking-wider">
                    {g.label}
                  </span>
                </div>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {gPartidos.map((p) => (
                    <PartidoCard key={p.id} partido={p} grupo={g.key} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
