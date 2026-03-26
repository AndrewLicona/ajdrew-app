export class AddEntryDto {
  participanteId: string;
  accion:
    | 'PARTICIPAR'
    | 'VOTAR_RANKING'
    | 'PARTICIPAR_BRACKET'
    | 'VER_TUTORIAL'
    | 'COMPARTIR'
    | 'REF_SOCIAL';
  origen?: string; // Detalles adicionales (nombre del ranking, id del bracket, etc.)
}
