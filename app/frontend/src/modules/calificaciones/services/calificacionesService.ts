import { Categoria, ItemCalificable, RankingItem } from "../types";

const getApiUrl = () => {
  return typeof window === 'undefined'
    ? process.env.INTERNAL_API_URL
    : process.env.NEXT_PUBLIC_API_URL;
};

// Opciones de fetch con caché (para categorías, por ejemplo)
const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
  next: { revalidate: 30 },
  cache: 'force-cache' as RequestCache
};

// Opciones sin caché (para datos que deben refrescarse al instante)
const noCacheOptions: RequestInit = {
  cache: 'no-store' as RequestCache
};

// ✅ Generar o recuperar un deviceId único
export function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

// ✅ Obtener juegos
export async function fetchJuegos(): Promise<any[]> {
  try {
    const response = await fetch(`${getApiUrl()}/juegos`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch juegos:", error);
    return [];
  }
}

// ✅ Obtener categorías (SIN caché para reflejar cambios de seed al instante)
export async function fetchCategories(): Promise<Categoria[]> {
  try {
    const response = await fetch(`${getApiUrl()}/categorias`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

// ✅ Obtener ítems de una tabla de calificación (por tablaId) o categoría genérica
export async function fetchItemsForCategory(tablaId: string, deviceId?: string): Promise<ItemCalificable[]> {
  if (!tablaId) return [];

  try {
    const baseUrl = `${getApiUrl()}/items-calificables`;
    // Use tablaId instead of categoryId so we only get items assigned to this tabla
    const url = `${baseUrl}?tablaId=${tablaId}`;

    const options: RequestInit = deviceId ? { ...noCacheOptions } : { ...fetchOptions };

    if (deviceId) {
      options.headers = {
        'Content-Type': 'application/json',
        'x-device-id': deviceId,
      };
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.items || []);
  } catch (error) {
    console.error(`Error fetching items for tabla ${tablaId}:`, error);
    return [];
  }
}

// ✅ Obtener ranking (SIN caché para ver cambios al instante)
export async function fetchRanking(tablaId?: string, limit?: number): Promise<RankingItem[]> {
  try {
    let url = tablaId
      ? `${getApiUrl()}/calificaciones/ranking-list?tablaId=${tablaId}`
      : `${getApiUrl()}/calificaciones/ranking-list`;

    // Agregar parámetro limit si existe
    if (limit) {
      url += tablaId ? `&limit=${limit}` : `?limit=${limit}`;
    }

    // 🔥 forzar no-store para refrescar siempre
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Error al cargar el ranking: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch ranking:", error);
    return [];
  }
}

// ✅ Enviar calificación de un ítem
export async function submitRating(itemId: string, rating: number, tablaId?: string): Promise<ItemCalificable> {
  const deviceId = getOrCreateDeviceId();

  const response = await fetch(`${getApiUrl()}/calificaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-device-id': deviceId,
    },
    body: JSON.stringify({ itemId, puntuacion: rating, tablaId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
