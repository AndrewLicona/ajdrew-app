export interface Categoria {
  id: string;
  nombre: string;
  activa: boolean;
  tipo: string;
}

export type CategoryWithItems = Categoria & { hasItems: true };

export interface ItemCalificable {
  id: string;
  nombre: string;
  categoriaId: string;
  image?: string;
  averageRating?: number;
  ratingCount?: number;
  myRating?: number;
}

export interface RankingItem {
  id?: string;
  itemId: string;
  itemName: string;
  itemImage?: string;
  categoryName?: string;
  averageRating: number;
  ratingCount: number;
  [key: string]: unknown;
}
