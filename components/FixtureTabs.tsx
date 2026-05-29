'use client'

import { useState } from 'react'
import PartidoCard from './PartidoCard'
import { Partido, Fecha, Grupo, getColorGrupo } from '@/lib/types'
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
}

const formatTabDate = (fechaStr: string) => {
  const [, mes, dia] = fechaStr.split('-')
  return `${dia}.${mes}`
}

// Calcula tabla de posiciones para un grupo a partir de todos los partidos jugados
function getStandings(
  partidos: Partido[],
  grupo: Grupo,
  excludeFechaId?: number
): { id: number; nombre: string; pts: number; dif: number }[] {
  const stats: Record<number, { nombre: string; pts: number; dif: number }> = {}

  for (const p of partidos) {
    if (!p.jugado || p.set1_p1 === null) continue
    if (excludeFechaId && p.fecha_id === excludeFechaId) continue
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

function slot(st: { nombre: string }[], pos: number): string {
  return st[pos - 1]?.nombre ?? `${pos}° del grupo`
}

export default function FixtureTabs({ fechas, partidos, proximaId, bracketFechaId }: Props) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<number>(
    proximaId ?? fechas[0]?.id ?? 0
  )

  const fecha = fechas.find((f) => f.id === fechaSeleccionada)
  const partidosFecha = partidos.filter((p) => p.fecha_id === fechaSeleccionada)
  const esBracket = bracketFechaId !== undefined && fechaSeleccionada === bracketFechaId

  // Standings para el bracket (excluye la propia fecha del bracket)
  const stPrincipiante = esBracket ? getStandings(partidos, 'principiante', bracketFechaId) : []
  const stCMenos       = esBracket ? getStandings(partidos, 'c_menos',      bracketFechaId) : []

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {fechas.map((f) => {
          const activa   = f.id === fechaSeleccionada
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

      {esBracket ? (
        /* ── Bracket Semifinales / Cuartos de Final ─────────────────────── */
        <div className="space-y-4">
          <p className="text-xs text-gray-400 -mt-1">Se actualiza según posiciones actuales</p>

          {/* ── Principiante: Semifinales ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-[#6d28d9] text-white">
              <h3 className="font-bold text-sm uppercase tracking-wider">Principiante — Semifinales</h3>
            </div>
            <div className="flex">
              {/* Partidos */}
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
              {/* Etiquetas: flex-col flex-1 → siempre 50/50 */}
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

          {/* ── C−: Cuartos de Final ── */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-[#156082] text-white">
              <h3 className="font-bold text-sm uppercase tracking-wider">C− — Cuartos de Final</h3>
            </div>
            <div className="flex">
              {/* Partidos */}
              <div className="flex-1 min-w-0 divide-y divide-gray-100">
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
              {/* Etiquetas: flex-col flex-1 → siempre 50/50 */}
              <div className="flex flex-col shrink-0 w-[4.5rem]">
                <div className="flex-1 bg-green-600 flex items-center justify-center px-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white text-center leading-tight">CUARTOS<br/>DE FINAL</span>
                </div>
                <div className="flex-1 bg-gray-400 flex items-center justify-center px-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white text-center leading-tight">9° / 10°<br/>LUGAR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grupos restantes con partidos normales (si los hubiere) */}
          {GRUPOS.filter((g) => g.key !== 'principiante' && g.key !== 'c_menos').map((g) => {
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
