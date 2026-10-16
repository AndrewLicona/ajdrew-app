// Tipos extendidos para PrismaClient - solo para TypeScript
// La extension real se aplica en runtime en prisma.service.ts

import { PrismaClient } from '@prisma/client';

export type TypedPrismaClient = PrismaClient & {
  bracketVote: {
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
  itemCalificable: {
    findUnique: (args: any) => Promise<any>;
  };
};