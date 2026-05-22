import { getFechas, getPartidos } from '@/lib/data'
import FixtureTabs from '@/components/FixtureTabs'

export const revalidate = 60

export default async function FixturePage() {
  const [fechas, partidos] = await Promise.all([
    getFechas(),
    getPartidos(),
  ])

  // Solo mostrar fechas con fixture real cargado (>= 5 partidos), de más reciente a más antigua
  const conteoPorFecha = partidos.reduce<Record<number, number>>((acc, p) => {
    acc[p.fecha_id] = (acc[p.fecha_id] ?? 0) + 1
    return acc
  }, {})
  const fechasMostrar = [...fechas]
    .filter((f) => (conteoPorFecha[f.id] ?? 0) >= 5)
    .reverse()

  return (
    <div className="pb-4">
      <h1 className="text-xl font-bold text-[#6d28d9] mb-4">Fixture</h1>
      <FixtureTabs fechas={fechasMostrar} partidos={partidos} />
    </div>
  )
}
