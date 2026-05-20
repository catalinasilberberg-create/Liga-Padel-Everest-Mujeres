import { getFechas, getPartidos } from '@/lib/data'
import FixtureTabs from '@/components/FixtureTabs'

export const revalidate = 60

export default async function FixturePage() {
  const [fechas, partidos] = await Promise.all([
    getFechas(),
    getPartidos(),
  ])

  const hoy = new Date().toISOString().split('T')[0]
  const fechasProximas = fechas.filter((f) => f.fecha >= hoy)
  const proximaId = fechasProximas[0]?.id ?? null

  // Mostrar solo fechas futuras; si no hay, mostrar todas
  const fechasMostrar = fechasProximas.length > 0 ? fechasProximas : fechas

  return (
    <div className="pb-4">
      <h1 className="text-xl font-bold text-[#6d28d9] mb-4">Fixture</h1>
      <FixtureTabs fechas={fechasMostrar} partidos={partidos} proximaId={proximaId} />
    </div>
  )
}
