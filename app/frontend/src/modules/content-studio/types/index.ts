/**
 * Tipos para el módulo Content Studio (frontend).
 */

export type TipoRecurso = 'sorteo' | 'tutorial' | 'bracket' | 'ranking';
export type Plataforma = 'discord' | 'x' | 'meta' | 'youtube';
export const PLATAFORMAS: Plataforma[] = ['discord', 'x', 'meta', 'youtube'];

export const TIPOS_RECURSO: TipoRecurso[] = [
  'sorteo',
  'tutorial',
  'bracket',
  'ranking',
];

export const TIPOS_RECURSO_LABEL: Record<TipoRecurso, string> = {
  sorteo: 'Sorteo',
  tutorial: 'Tutorial',
  bracket: 'Votación / Bracket',
  ranking: 'Ranking / Tabla',
};

export type EstadoPublicacion = 'PENDIENTE' | 'PUBLICADO' | 'FALLIDO' | 'PROGRAMADO';
export const ESTADOS: EstadoPublicacion[] = [
  'PENDIENTE',
  'PUBLICADO',
  'FALLIDO',
  'PROGRAMADO',
];

export interface PreviewPlataforma {
  texto: string;
  textoTruncado?: string;
  imageUrl?: string;
  charCount: number;
  placeholdersUsados: string[];
  placeholdersFaltantes: string[];
}

export type PreviewResult = Record<string, PreviewPlataforma>;

export interface Recurso {
  id: string;
  titulo?: string;
  nombre?: string;
  tematica?: string;
  slug?: string;
  estado?: string;
  juegoId?: string;
  juego?: { id: string; nombre: string; image?: string };
}

export interface SocialPublication {
  id: string;
  evento: string;
  referenciaTipo: string;
  referenciaId: string;
  plataforma: Plataforma;
  estado: EstadoPublicacion;
  textoFinal: string;
  imageUrl?: string;
  errorMsg?: string;
  publicadoAt?: string;
  programadoPara?: string;
  intentos: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationsResponse {
  publications: SocialPublication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SocialTemplate {
  id: string | null;
  tipo: string;
  plataforma: Plataforma;
  template: string;
  activo: boolean;
  isDefault?: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}