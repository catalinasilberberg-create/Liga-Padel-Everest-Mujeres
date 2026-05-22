import { getFechas, getPartidos } from '@/lib/data'
import PartidoCard from '@/components/PartidoCard'
import { Grupo, getColorGrupo } from '@/lib/types'

const GRUPOS: { key: Grupo; label: string }[] = [
  { key: 'principiante',   label: 'Principiante' },
  { key: 'd_copa_oro',     label: 'D — Copa Oro' },
  { key: 'd_copa_plata_1', label: 'D — Copa Plata 1' },
  { key: 'd_copa_plata_2', label: 'D — Copa Plata 2' },
  { key: 'c_menos',        label: 'C−' },
  { key: 'c_mas',          label: 'C+' },
]

export const revalidate = 0

export default async function ResultadosPage() {
  const [fechas, todosPartidos] = await Promise.all([
    getFechas(),
    getPartidos(),
  ])

  const hoy = new Date().toISOString().split('T')[0]
  const fechasJugadas = fechas.filter((f) => f.fecha <= hoy).reverse()

  const formatFecha = (f: string) =>
    new Date(f + 'T12:00:00').toLocaleDateString('es-CL', {
      weekday: 'long', day: 'numeric', month: 'long',
    })

  return (
    <div className="space-y-6 pb-4">
      <h1 className="text-xl font-bold text-[#6d28d9]">Resultados</h1>

      {fechasJugadas.length === 0 && (
        <p className="text-gray-400 text-sm">Aún no hay resultados cargados.</p>
      )}

      {fechasJugadas.map((fecha) => {
        const partidos = todosPartidos.filter((p) => p.fecha_id === fecha.id && p.jugado)
        if (partidos.length === 0) return null

        return (
          <section key={fecha.id}>
            <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-100">
              <span className="text-sm font-bold px-2.5 py-1 rounded-md bg-[#6d28d9] text-white">
                {fecha.label}
              </span>
              <span className="text-sm text-gray-500 capitalize">{formatFecha(fecha.fecha)}</span>
            </div>

            {GRUPOS.map((g) => {
              const gPartidos = partidos.filter((p) => p.pareja1?.grupo === g.key)
              if (gPartidos.length === 0) return null
              const color = getColorGrupo(g.key)

              return (
                <div key={g.key} className="mb-5">
                  <div
                    style={{ borderLeftColor: color.header, backgroundColor: color.bg }}
                    className="border-l-4 px-3 py-1.5 rounded-r-lg mb-2"
                  >
                    <span style={{ color: color.header }} className="text-xs font-bold uppercase tracking-wider">
                      {g.label}
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {gPartidos.map((p) => (
                      <PartidoCard key={p.id} partido={p} grupo={g.key} />
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}
