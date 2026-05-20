import { PosicionGrupo, Grupo, getColorGrupo } from '@/lib/types'

interface Props {
  titulo: string
  posiciones: PosicionGrupo[]
  nota?: string
  grupo?: Grupo
}

export default function TablaGrupo({ titulo, posiciones, nota, grupo }: Props) {
  const color = grupo ? getColorGrupo(grupo) : { header: '#6d28d9', bg: '#f5f3ff' }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div style={{ backgroundColor: color.header }} className="text-white px-4 py-2.5">
        <h2 className="font-bold text-sm uppercase tracking-wider">{titulo}</h2>
        {nota && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>{nota}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: color.bg }} className="text-gray-500 text-xs uppercase">
              <th className="px-3 py-2 text-left w-6">#</th>
              <th className="px-3 py-2 text-left">Pareja</th>
              <th className="px-3 py-2 text-center">PJ</th>
              <th className="px-3 py-2 text-center font-bold" style={{ color: color.header }}>Pts</th>
              <th className="px-3 py-2 text-center">Dif</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posiciones.map((p) => (
              <tr
                key={p.pareja.id}
                style={p.posicion === 1 ? { backgroundColor: color.bg } : undefined}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-3 py-2.5 text-gray-400 text-xs font-medium">{p.posicion}</td>
                <td className="px-3 py-2.5 text-gray-800">
                  {p.posicion === 1 && <span className="mr-1 text-xs">🥇</span>}
                  {p.posicion === 2 && <span className="mr-1 text-xs">🥈</span>}
                  {p.pareja.nombre}
                </td>
                <td className="px-3 py-2.5 text-center text-gray-400 text-xs">{p.pj}</td>
                <td className="px-3 py-2.5 text-center font-bold" style={{ color: color.header }}>{p.pts}</td>
                <td className={`px-3 py-2.5 text-center text-xs font-medium ${p.dif > 0 ? 'text-green-600' : p.dif < 0 ? 'text-red-400' : 'text-gray-300'}`}>
                  {p.dif > 0 ? `+${p.dif}` : p.dif}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
