export class CreateTutorialDto {
    titulo: string;
    slug: string;
    videoUrl: string;
    descripcion?: string;
    image?: string;
    autor?: string;
    autorUrl?: string;
    imageCover?: string;
    dificultad: string; // FACIL, MEDIO, PRO
    juegoId: string;
    categoriaId?: string;
    destacado?: boolean;
    pasos?: {
        orden: number;
        titulo: string;
        descripcion?: string;
        image?: string;
    }[];
}
