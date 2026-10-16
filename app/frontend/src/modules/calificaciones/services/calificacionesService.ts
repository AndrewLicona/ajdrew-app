import { Categoria, ItemCalificable, RankingItem } from "../types";

const getApiUrl = () => {
  return typeof window === 'undefined'
    ? process.env.INTERNAL_API_URL
    : process.env.NEXT_PUBLIC_API_URL;
};

// ✅ Generar o recuperar un deviceId único (localStorage + header)
export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

// Headers base con deviceId
function getHeaders(): HeadersInit {
  const deviceId = getOrCreateDeviceId();
  return {
    'Content-Type': 'application/json',
    'x-device-id': deviceId,
  };
}

// Opciones base
const baseOptions: RequestInit = {
  credentials: 'include',
  headers: getHeaders(),
};

// Opciones de fetch con caché
const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
  ...baseOptions,
  next: { revalidate: 30 },
  cache: 'force-cache' as RequestCache
};

// Opciones sin caché
const noCacheOptions: RequestInit = {
  ...baseOptions,
  cache: 'no-store' as RequestCache
};

// ✅ Obtener juegos
export async function fetchJuegos(): Promise<any[]> {
  try {
    const response = await fetch(`${getApiUrl()}/juegos`, { ...baseOptions, cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch juegos:", error);
    return [];
  }
}

// ✅ Obtener categorías
export async function fetchCategories(): Promise<Categoria[]> {
  try {
    const response = await fetch(`${getApiUrl()}/categorias`, { ...baseOptions, cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

// ✅ Obtener ítems
export async function fetchItemsForCategory(tablaId: string): Promise<ItemCalificable[]> {
  if (!tablaId) return [];
  try {
    const url = `${getApiUrl()}/items-calificables?tablaId=${tablaId}`;
    const response = await fetch(url, { ...noCacheOptions });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : (data.items || []);
  } catch (error) {
    console.error(`Error fetching items for tabla ${tablaId}:`, error);
    return [];
  }
}

// ✅ Obtener ranking
export async function fetchRanking(tablaId?: string, limit?: number): Promise<RankingItem[]> {
  try {
    let url = tablaId
      ? `${getApiUrl()}/calificaciones/ranking-list?tablaId=${tablaId}`
      : `${getApiUrl()}/calificaciones/ranking-list`;
    if (limit) url += tablaId ? `&limit=${limit}` : `?limit=${limit}`;
    const response = await fetch(url, { ...baseOptions, cache: 'no-store' });
    if (!response.ok) throw new Error(`Error al cargar el ranking: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch ranking:", error);
    return [];
  }
}

// ✅ Enviar calificación
export async function submitRating(itemId: string, rating: number, tablaId?: string): Promise<ItemCalificable> {
  const response = await fetch(`${getApiUrl()}/calificaciones`, {
    method: 'POST',
    ...baseOptions,
    body: JSON.stringify({ itemId, puntuacion: rating, tablaId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}