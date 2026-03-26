export class CreateBracketDto {
  tematica: string;
  slug: string;
  juegoId: string;
  categoriaId?: string;
  activa?: boolean;
  estado?: string;
  rondaDuracion?: number; // In hours
  proximoCierreAt?: Date;
  itemsIds: string[]; // List of items to start the bracket
}

export class VoteBracketDto {
  matchId: string;
  itemId: string; // The winning item in this match
}
