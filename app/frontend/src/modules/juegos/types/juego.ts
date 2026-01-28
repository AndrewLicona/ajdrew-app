export interface Item {
    id: string;
    nombre: string;
    image?: string;
    averageRating?: number;
}

export interface Categoria {
    id: string;
    nombre: string;
    tipo: string;
    items: Item[];
    votaciones?: any[];
}

export interface Sorteo {
    id: string;
    titulo: string;
    premio: string;
    image?: string;
    fechaFin: string;
    estado: string;
    externalUrl?: string; // Nuevo: Link a video de YT/Twitch
}

export interface Juego {
    id: string;
    nombre: string;
    slug: string;
    descripcion: string;
    image: string;
    categorias: Categoria[];
    votaciones?: any[];
    sorteos?: any[];
    tutoriales?: any[];
}
