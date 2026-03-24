export class CreateTablaCalificacionDto {
  nombre: string;
  slug: string;
  descripcion?: string;
  image?: string;
  estado?: string;
  juegoId: string;
  categoriaId?: string;
  itemsIds?: string[];
}

export class UpdateTablaCalificacionDto {
  nombre?: string;
  slug?: string;
  descripcion?: string;
  image?: string;
  estado?: string;
  juegoId?: string;
  categoriaId?: string;
  itemsIds?: string[];
}
