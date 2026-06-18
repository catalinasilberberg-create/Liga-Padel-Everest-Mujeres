import { getFechas, getPartidos, getProximaFecha } from '@/lib/data'
import FixtureTabs from '@/components/FixtureTabs'

export const revalidate = 0

// Fecha donde Principiante juega Semifinales y C− juega Cuartos de Final
const BRACKET_FECHA_ID = 25

export default async function FixturePage() {
  const [fechas, partidos, proxima] = await Promise.all([
    getFechas(),
    getPartidos(),
    getProximaFecha(),
  ])

  const conteoPorFecha = partidos.reduce<Record<number, number>>((acc, p) => {
    acc[p.fecha_id] = (acc[p.fecha_id] ?? 0) + 1
    return acc
  }, {})

  // Fecha de finales (miércoles 08.07.2026)
  const finalesFecha = fechas.find((f) => f.fecha === '2026-07-08')
  const FINALES_FECHA_ID = finalesFecha?.id

  // Mostrar fechas con partidos cargados (≥5) + siempre mostrar bracket y finales
  const fechasMostrar = [...fechas]
    .filter((f) =>
      (conteoPorFecha[f.id] ?? 0) >= 5 ||
      f.id === BRACKET_FECHA_ID ||
      (FINALES_FECHA_ID !== undefined && f.id === FINALES_FECHA_ID)
    )
    .reverse()

  const proximaId = proxima?.id ?? fechasMostrar[0]?.id ?? null

  const fecha10Ids  = fechas.filter((f) => f.numero <= 10).map((f) => f.id)
  const fechaD10Ids = fechas.filter((f) => f.numero >= 6 && f.numero <= 10).map((f) => f.id)

  return (
    <div className="pb-4">
      <h1 className="text-xl font-bold text-[#6d28d9] mb-4">Fixture</h1>
      <FixtureTabs
        fechas={fechasMostrar}
        partidos={partidos}
        proximaId={proximaId}
        bracketFechaId={BRACKET_FECHA_ID}
        finalsFechaId={FINALES_FECHA_ID}
        fecha10Ids={fecha10Ids}
        fechaD10Ids={fechaD10Ids}
      />
    </div>
  )
}
