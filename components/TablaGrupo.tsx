import { PosicionGrupo, Grupo, getColorGrupo } from '@/lib/types'

interface Zona {
  hasta: number      // posición inclusive donde termina esta zona (ej: 4)
  etiqueta: string   // ej: "Semifinales", "Cuartos de Final", "Demás Lugares"
  clasifica: boolean // true = verde, false = gris
}

interface Props {
  titulo: string
  posiciones: PosicionGrupo[]
  nota?: string
  grupo?: Grupo
  zonas?: Zona[]
}

function getZona(pos: number, zonas: Zona[]): Zona | undefined {
  // Zonas ordenadas por 'hasta' ascendente
  return zonas.find((z) => pos <= z.hasta)
}

export default function TablaGrupo({ titulo, posiciones, nota, grupo, zonas }: Props) {
  const color = grupo ? getColorGrupo(grupo) : { header: '#6d28d9', bg: '#f5f3ff' }

  // Construimos las filas intercalando separadores de zona
  const rows: ({ type: 'fila'; pos: PosicionGrupo } | { type: 'separador'; etiqueta: string; clasifica: boolean })[] = []

  if (zonas && zonas.length > 0) {
    let zonaActual: Zona | undefined = undefined
    for (const p of posiciones) {
      const z = getZona(p.posicion, zonas)
      if (z && z !== zonaActual) {
        rows.push({ type: 'separador', etiqueta: z.etiqueta, clasifica: z.clasifica })
        zonaActual = z
      }
      rows.push({ type: 'fila', pos: p })
    }
  } else {
    posiciones.forEach((p) => rows.push({ type: 'fila', pos: p }))
  }

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
          <tbody>
            {rows.map((row, i) => {
              if (row.type === 'separador') {
                return (
                  <tr key={`sep-${i}`}>
                    <td
                      colSpan={5}
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        row.clasifica
                          ? 'bg-green-50 text-green-700 border-t-2 border-green-200'
                          : 'bg-gray-50 text-gray-400 border-t-2 border-gray-200'
                      }`}
                    >
                      {row.clasifica ? '▲ ' : '▽ '}{row.etiqueta}
                    </td>
                  </tr>
                )
              }

              const p = row.pos
              const zona = zonas ? getZona(p.posicion, zonas) : undefined
              const borderColor = zona
                ? zona.clasifica ? '#16a34a' : '#9ca3af'
                : undefined

              return (
                <tr
                  key={p.pareja.id}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-50"
                >
                  <td className="py-2.5 pl-0 pr-2 text-gray-400 text-xs font-medium w-8">
                    <div
                      className="flex items-center justify-center h-full"
                      style={borderColor ? { borderLeft: `3px solid ${borderColor}`, paddingLeft: '0.5rem' } : { paddingLeft: '0.75rem' }}
                    >
                      {p.posicion}
                    </div>
                  </td>
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
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
