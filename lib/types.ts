export type Grupo =
  | 'principiante'
  | 'd_copa_oro'
  | 'd_copa_plata_1'
  | 'd_copa_plata_2'
  | 'c_menos'
  | 'c_mas'

export interface Pareja {
  id: number
  jugador1: string
  jugador2: string
  grupo: Grupo
  nombre: string
}

export interface Fecha {
  id: number
  numero: number
  fecha: string
  label: string
}

export interface Partido {
  id: number
  fecha_id: number
  pareja1_id: number
  pareja2_id: number
  set1_p1: number | null
  set1_p2: number | null
  set2_p1: number | null
  set2_p2: number | null
  tb_p1: number | null
  tb_p2: number | null
  lugar: string | null
  cancha: string | null
  hora: string | null
  jugado: boolean
  // joined
  pareja1?: Pareja
  pareja2?: Pareja
  fecha?: Fecha
  puntos_p1?: number
  puntos_p2?: number
}

export interface PosicionGrupo {
  pareja: Pareja
  pj: number
  pts: number
  dif: number
  posicion: number
}

export function getLabelGrupo(grupo: Grupo): string {
  switch (grupo) {
    case 'principiante': return 'Principiante'
    case 'd_copa_oro': return 'D — Copa Oro'
    case 'd_copa_plata_1': return 'D — Copa Plata 1'
    case 'd_copa_plata_2': return 'D — Copa Plata 2'
    case 'c_menos': return 'C−'
    case 'c_mas': return 'C+'
  }
}

export function getDivision(grupo: Grupo): string {
  if (grupo === 'principiante') return 'Principiante'
  if (grupo.startsWith('d_')) return 'Categoría D'
  if (grupo === 'c_menos') return 'C−'
  if (grupo === 'c_mas') return 'C+'
  return grupo
}
