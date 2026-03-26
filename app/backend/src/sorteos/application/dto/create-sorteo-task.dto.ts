export class CreateSorteoTaskDto {
  tipo: 'SEGUIR' | 'COMENTAR' | 'COMPARTIR' | 'LIKE' | 'SUSCRIBIR';
  plataforma: 'YOUTUBE' | 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'TWITTER';
  obligatorio: boolean;
  url?: string;
  descripcion?: string;
}
