export class CreateItemCalificableDto {
  nombre: string;
  image?: string;
  juegoId?: string;
  version?: string; // Ej: "TOTY 24", "TOTS", "Base" — opcional, solo para FC/eFootball
  grl?: number;     // Media/rating de la carta — opcional
}
