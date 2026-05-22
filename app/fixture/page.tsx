import { getFechas, getPartidos } from '@/lib/data'
import FixtureTabs from '@/components/FixtureTabs'

export const revalidate = 60

export default async function FixturePage() {
  const [fechas, partidos] = await Promise.all([
    getFechas(),
    getPartidos(),
  ])

  // Solo mostrar fechas que tienen partidos cargados, de más reciente a más antigua
  const fechaConPartidos = new Set(partidos.map((p) => p.fecha_id))
  const fechasMostrar = [...fechas]
    .filter((f) => fechaConPartidos.has(f.id))
    .reverse()

  return (
    <div className="pb-4">
      <h1 className="text-xl font-bold text-[#6d28d9] mb-4">Fixture</h1>
      <FixtureTabs fechas={fechasMostrar} partidos={partidos} />
    </div>
  )
}
