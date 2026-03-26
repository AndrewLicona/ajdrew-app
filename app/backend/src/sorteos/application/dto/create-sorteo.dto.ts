export class CreateSorteoDto {
  titulo: string;
  descripcion?: string;
  premio: string;
  image?: string;
  fechaFin: string | Date;
  juegoId?: string;
  numGanadores?: number;
  tareas?: {
    tipo: string;
    plataforma: string;
    obligatorio: boolean;
    url?: string;
    descripcion?: string;
  }[];
  estado?: string;
}
