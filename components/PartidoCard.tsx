import { Partido, Grupo, getColorGrupo } from '@/lib/types'
import { calcularPuntos, formatResultado } from '@/lib/calculos'

interface Props {
  partido: Partido
  grupo?: Grupo
}

export default function PartidoCard({ partido, grupo }: Props) {
  const pts = calcularPuntos(partido)
  const resultado = formatResultado(partido)
  const jugado = partido.jugado
  const color = grupo ? getColorGrupo(grupo) : { header: '#6d28d9', bg: '#f5f3ff' }

  const ganadorP1 = jugado && pts.p1 > pts.p2
  const ganadorP2 = jugado && pts.p2 > pts.p1

  return (
    <div
      style={{ borderLeftColor: color.header }}
      className={`rounded-lg border border-gray-100 border-l-4 px-2.5 py-2 text-sm ${
        jugado ? 'bg-white' : 'bg-gray-50'
      }`}
    >
      {/* Hora y lugar */}
      {partido.lugar === 'Suspendido' ? (
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-wide">
            Suspendido
          </span>
        </div>
      ) : (partido.hora || partido.lugar || partido.cancha) ? (
        <div className="flex items-center gap-1.5 mb-1.5">
          {partido.hora && (
            <span
              style={{ backgroundColor: color.bg, color: color.header }}
              className="text-xs font-semibold px-1.5 py-0.5 rounded"
            >
              {partido.hora}
            </span>
          )}
          {(partido.lugar || partido.cancha) && (
            <span className="text-xs text-gray-400">
              {[partido.lugar, partido.cancha ? `· Cancha ${partido.cancha}` : ''].filter(Boolean).join(' ')}
            </span>
          )}
        </div>
      ) : null}

      {/* Pareja 1 */}
      <div className="flex justify-between items-center">
        <span className={`flex-1 leading-tight text-xs ${ganadorP1 ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
          {partido.pareja1?.nombre ?? ''}
        </span>
        {jugado && (
          <span
            className="ml-2 text-sm font-bold w-5 text-right tabular-nums"
            style={{ color: ganadorP1 ? color.header : '#d1d5db' }}
          >
            {pts.p1}
          </span>
        )}
      </div>

      {/* Resultado / vs */}
      {jugado ? (
        <div className="text-center text-xs text-gray-400 my-0.5 font-mono tracking-wider">
          {resultado}
        </div>
      ) : (
        <div className="text-center text-xs text-gray-300 my-0.5 font-medium">vs</div>
      )}

      {/* Pareja 2 */}
      <div className="flex justify-between items-center">
        <span className={`flex-1 leading-tight text-xs ${ganadorP2 ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
          {partido.pareja2?.nombre ?? ''}
        </span>
        {jugado && (
          <span
            className="ml-2 text-sm font-bold w-5 text-right tabular-nums"
            style={{ color: ganadorP2 ? color.header : '#d1d5db' }}
          >
            {pts.p2}
          </span>
        )}
      </div>
    </div>
  )
}
