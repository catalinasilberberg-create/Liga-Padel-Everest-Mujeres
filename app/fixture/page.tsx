import { getFechas, getPartidos, getParejas, getProximaFecha } from '@/lib/data'
import { calcularPosiciones } from '@/lib/calculos'
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

  // Standings de D usando calcularPosiciones (igual que página de posiciones)
  const [parejasOro, parejasP1, parejasP2] = await Promise.all([
    getParejas('d_copa_oro'),
    getParejas('d_copa_plata_1'),
    getParejas('d_copa_plata_2'),
  ])
  const posOro    = calcularPosiciones(parejasOro, partidos.filter(p => p.pareja1?.grupo === 'd_copa_oro'     || p.pareja2?.grupo === 'd_copa_oro'),     6)
  const posPlata1 = calcularPosiciones(parejasP1,  partidos.filter(p => p.pareja1?.grupo === 'd_copa_plata_1' || p.pareja2?.grupo === 'd_copa_plata_1'), 6)
  const posPlata2 = calcularPosiciones(parejasP2,  partidos.filter(p => p.pareja1?.grupo === 'd_copa_plata_2' || p.pareja2?.grupo === 'd_copa_plata_2'), 6)

  return (
    <div className="pb-4">
      <h1 className="text-xl font-bold text-[#6d28d9] mb-4">Fixture</h1>
      <FixtureTabs
        fechas={fechasMostrar}
        partidos={partidos}
        proximaId={proximaId}
        bracketFechaId={BRACKET_FECHA_ID}
        finalsFechaId={FINALES_FECHA_ID}
        posOro={posOro}
        posPlata1={posPlata1}
        posPlata2={posPlata2}
      />
    </div>
  )
}
