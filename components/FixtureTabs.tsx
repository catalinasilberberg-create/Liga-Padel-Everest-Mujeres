'use client'

import { useState } from 'react'
import PartidoCard from './PartidoCard'
import { Partido, Fecha, Grupo, getColorGrupo } from '@/lib/types'

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
  proximaId: number | null
}

export default function FixtureTabs({ fechas, partidos, proximaId }: Props) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<number>(
    proximaId ?? fechas[0]?.id ?? 0
  )

  const fecha = fechas.find((f) => f.id === fechaSeleccionada)
  const partidosFecha = partidos.filter((p) => p.fecha_id === fechaSeleccionada)

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {fechas.map((f) => {
          const activa = f.id === fechaSeleccionada
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
              {f.label}
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

      {/* Contenido de la fecha seleccionada */}
      {fecha && (
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
