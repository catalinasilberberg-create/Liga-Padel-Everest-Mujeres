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

  // Mostrar fechas con partidos cargados (≥5) + siempre mostrar la fecha de bracket
  const fechasMostrar = [...fechas]
    .filter((f) => (conteoPorFecha[f.id] ?? 0) >= 5 || f.id === BRACKET_FECHA_ID || f.id === 10)
    .reverse()

  const proximaId = proxima?.id ?? fechasMostrar[0]?.id ?? null

  return (
    <div className="pb-4">
      <h1 className="text-xl font-bold text-[#6d28d9] mb-4">Fixture</h1>
      <FixtureTabs
        fechas={fechasMostrar}
        partidos={partidos}
        proximaId={proximaId}
        bracketFechaId={BRACKET_FECHA_ID}
      />
    </div>
  )
}
