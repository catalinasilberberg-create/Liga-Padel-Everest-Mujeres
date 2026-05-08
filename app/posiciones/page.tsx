import { getParejas, getPartidos, getUltimaFecha } from '@/lib/data'
import { calcularPosiciones } from '@/lib/calculos'
import TablaGrupo from '@/components/TablaGrupo'
import { Grupo, getLabelGrupo } from '@/lib/types'

const GRUPOS: { key: Grupo; fechaMin?: number }[] = [
  { key: 'principiante' },
  { key: 'd_copa_oro', fechaMin: 6 },
  { key: 'd_copa_plata_1', fechaMin: 6 },
  { key: 'd_copa_plata_2', fechaMin: 6 },
  { key: 'c_menos' },
  { key: 'c_mas' },
]

export const revalidate = 60

export default async function PosicionesPage() {
  const [ultimaFecha, todosPartidos] = await Promise.all([
    getUltimaFecha(),
    getPartidos(),
  ])

  const tablas = await Promise.all(
    GRUPOS.map(async (g) => {
      const parejas = await getParejas(g.key)
      const partidos = todosPartidos.filter(
        (p) => p.pareja1?.grupo === g.key || p.pareja2?.grupo === g.key
      )
      return { ...g, posiciones: calcularPosiciones(parejas, partidos, g.fechaMin) }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#6d28d9]">Tabla de Posiciones</h1>
        {ultimaFecha && (
          <p className="text-sm text-gray-400 mt-0.5">Actualizado al cierre de la {ultimaFecha.label}</p>
        )}
      </div>

      <div className="bg-purple-50 border border-purple-100 rounded-lg px-4 py-3 text-xs text-purple-700 flex flex-wrap gap-x-4 gap-y-1">
        <span><strong>3 pts</strong> — Ganador</span>
        <span><strong>2 pts</strong> — Empate (1-1 sin TB)</span>
        <span><strong>1 pt</strong> — Perdedor en TB</span>
        <span><strong>0 pts</strong> — Perdedor</span>
      </div>

      <div className="space-y-4">
        {tablas.map((g) => (
          <TablaGrupo
            key={g.key}
            titulo={getLabelGrupo(g.key)}
            posiciones={g.posiciones}
            nota={g.fechaMin ? `Puntaje desde Fecha ${g.fechaMin}` : undefined}
          />
        ))}
      </div>
    </div>
  )
}
