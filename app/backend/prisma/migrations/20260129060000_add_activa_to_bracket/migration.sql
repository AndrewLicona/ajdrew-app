-- AlterTable
ALTER TABLE "VotacionBracket" 
ADD COLUMN "activa" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "proximoCierreAt" TIMESTAMP(3),
ADD COLUMN "rondaDuracion" INTEGER NOT NULL DEFAULT 0;
