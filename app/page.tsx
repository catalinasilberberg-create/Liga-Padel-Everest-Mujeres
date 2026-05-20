import { getParejas, getPartidos, getProximaFecha, getUltimaFecha } from '@/lib/data'
import { calcularPosiciones } from '@/lib/calculos'
import TablaGrupo from '@/components/TablaGrupo'
import PartidoCard from '@/components/PartidoCard'
import { Grupo, getLabelGrupo, getColorGrupo } from '@/lib/types'

const GRUPOS: { key: Grupo; label: string; fechaMin?: number }[] = [
  { key: 'principiante',   label: 'Principiante' },
  { key: 'd_copa_oro',     label: 'D — Copa Oro',     fechaMin: 6 },
  { key: 'd_copa_plata_1', label: 'D — Copa Plata 1', fechaMin: 6 },
  { key: 'd_copa_plata_2', label: 'D — Copa Plata 2', fechaMin: 6 },
  { key: 'c_menos',        label: 'C−' },
  { key: 'c_mas',          label: 'C+' },
]

export const revalidate = 60

export default async function HomePage() {
  const [proximaFecha, ultimaFecha] = await Promise.all([
    getProximaFecha(),
    getUltimaFecha(),
  ])

  const partidosProxima = proximaFecha ? await getPartidos(proximaFecha.id) : []
  const todosPartidos = await getPartidos()

  const tablas = await Promise.all(
    GRUPOS.map(async (g) => {
      const parejas = await getParejas(g.key)
      const partidos = todosPartidos.filter(
        (p) => p.pareja1?.grupo === g.key || p.pareja2?.grupo === g.key
      )
      return { ...g, posiciones: calcularPosiciones(parejas, partidos, g.fechaMin) }
    })
  )

  const formatFecha = (f: string) =>
    new Date(f + 'T12:00:00').toLocaleDateString('es-CL', {
      weekday: 'long', day: 'numeric', month: 'long',
    })

  return (
    <div className="space-y-8 pb-4">
      {/* Hero */}
      <div className="text-center py-2">
        <h1 className="text-2xl font-bold text-[#6d28d9]">Liga de Pádel Everest</h1>
        <p className="text-gray-400 text-sm mt-1">Mujeres · Primer Semestre 2026</p>
      </div>

      {/* Próxima fecha */}
      {proximaFecha && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-bold text-gray-700">{proximaFecha.label}</h2>
            <span className="text-sm text-gray-400 capitalize">{formatFecha(proximaFecha.fecha)}</span>
            <span className="ml-auto text-xs bg-purple-100 text-[#6d28d9] font-semibold px-2 py-0.5 rounded-full">Próxima</span>
          </div>

          {GRUPOS.map((g) => {
            const gPartidos = partidosProxima.filter((p) => p.pareja1?.grupo === g.key)
            if (gPartidos.length === 0) return null
            const color = getColorGrupo(g.key)
            return (
              <div key={g.key} className="mb-4">
                <div
                  style={{ borderLeftColor: color.header, backgroundColor: color.bg }}
                  className="border-l-4 px-3 py-1 rounded-r-lg mb-2"
                >
                  <span style={{ color: color.header }} className="text-xs font-bold uppercase tracking-wider">
                    {g.label}
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {gPartidos.map((p) => <PartidoCard key={p.id} partido={p} grupo={g.key} />)}
                </div>
              </div>
            )
          })}
        </section>
      )}

      {/* Posiciones */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-bold text-gray-700">
            Posiciones{ultimaFecha ? ` — ${ultimaFecha.label}` : ''}
          </h2>
        </div>
        <div className="space-y-4">
          {tablas.map((g) => (
            <TablaGrupo
              key={g.key}
              titulo={getLabelGrupo(g.key)}
              posiciones={g.posiciones}
              nota={g.fechaMin ? `Puntaje desde Fecha ${g.fechaMin}` : undefined}
              grupo={g.key}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
