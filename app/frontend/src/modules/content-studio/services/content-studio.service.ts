/**
 * Servicio frontend para Content Studio.
 *
 * Encapsula todas las llamadas al backend /api/content-studio.
 */
import {
  TipoRecurso,
  Plataforma,
  PreviewResult,
  PublicationsResponse,
  SocialPublication,
  SocialTemplate,
} from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

function authHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────────────
// PREVIEW
// ─────────────────────────────────────────────────────────────────────

export async function preview(params: {
  tipo: TipoRecurso;
  referenciaId: string;
  plataformas?: Plataforma[];
  textosOverride?: Record<string, string>;
}): Promise<PreviewResult> {
  return request('/content-studio/preview', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ─────────────────────────────────────────────────────────────────────
// PUBLISH NOW
// ─────────────────────────────────────────────────────────────────────

export async function publishNow(params: {
  tipo: TipoRecurso;
  referenciaId: string;
  plataformas: Plataforma[];
  textosOverride?: Record<string, string>;
  imageOverride?: string;
}): Promise<{ success: boolean; message: string; publications: SocialPublication[] }> {
  return request('/content-studio/publish', {
    method: 'POST',
    body: JSON.stringify({ ...params, inmediato: true }),
  });
}

// ─────────────────────────────────────────────────────────────────────
// SCHEDULE
// ─────────────────────────────────────────────────────────────────────

export async function schedule(params: {
  tipo: TipoRecurso;
  referenciaId: string;
  plataformas: Plataforma[];
  programadoPara: string; // ISO 8601
  textosOverride?: Record<string, string>;
}): Promise<{ success: boolean; message: string; publications: SocialPublication[] }> {
  return request('/content-studio/schedule', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ─────────────────────────────────────────────────────────────────────
// PUBLICATIONS (dashboard)
// ─────────────────────────────────────────────────────────────────────

export async function listPublications(params: {
  estado?: string;
  plataforma?: Plataforma;
  referenciaTipo?: TipoRecurso;
  referenciaId?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PublicationsResponse> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') search.append(k, String(v));
  });
  return request(`/content-studio/publications?${search.toString()}`);
}

export async function retryPublication(id: string): Promise<{ success: boolean }> {
  return request(`/content-studio/publications/${id}/retry`, { method: 'POST' });
}

// ─────────────────────────────────────────────────────────────────────
// TEMPLATES
// ─────────────────────────────────────────────────────────────────────

export async function listTemplates(): Promise<SocialTemplate[]> {
  return request('/content-studio/templates');
}

export async function updateTemplate(
  id: string,
  data: { template?: string; activo?: boolean },
): Promise<SocialTemplate> {
  return request(`/content-studio/templates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function seedTemplates(): Promise<{ inserted: number; skipped: number }> {
  return request('/content-studio/templates/seed', { method: 'POST' });
}

// ─────────────────────────────────────────────────────────────────────
// Helpers para cargar recursos (dropdown del wizard)
// ─────────────────────────────────────────────────────────────────────

export async function fetchRecursosByTipo(tipo: TipoRecurso): Promise<any[]> {
  const endpoint = {
    sorteo: '/sorteos',
    tutorial: '/tutoriales',
    bracket: '/votaciones',
    ranking: '/tablas-calificaciones',
  }[tipo];

  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) return [];
  return res.json();
}