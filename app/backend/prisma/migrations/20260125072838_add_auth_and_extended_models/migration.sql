-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'EDITOR');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotacionBracket" (
    "id" TEXT NOT NULL,
    "tematica" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'BORRADOR',
    "rondaActual" INTEGER NOT NULL DEFAULT 1,
    "juegoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VotacionBracket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BracketMatch" (
    "id" TEXT NOT NULL,
    "bracketId" TEXT NOT NULL,
    "ronda" INTEGER NOT NULL,
    "itemAId" TEXT,
    "itemBId" TEXT,
    "votosA" INTEGER NOT NULL DEFAULT 0,
    "votosB" INTEGER NOT NULL DEFAULT 0,
    "ganadorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BracketMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sorteo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "premio" TEXT NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "juegoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sorteo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VotacionBracket_slug_key" ON "VotacionBracket"("slug");

-- AddForeignKey
ALTER TABLE "VotacionBracket" ADD CONSTRAINT "VotacionBracket_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketMatch" ADD CONSTRAINT "BracketMatch_bracketId_fkey" FOREIGN KEY ("bracketId") REFERENCES "VotacionBracket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketMatch" ADD CONSTRAINT "BracketMatch_itemAId_fkey" FOREIGN KEY ("itemAId") REFERENCES "ItemCalificable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketMatch" ADD CONSTRAINT "BracketMatch_itemBId_fkey" FOREIGN KEY ("itemBId") REFERENCES "ItemCalificable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketMatch" ADD CONSTRAINT "BracketMatch_ganadorId_fkey" FOREIGN KEY ("ganadorId") REFERENCES "ItemCalificable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sorteo" ADD CONSTRAINT "Sorteo_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE SET NULL ON UPDATE CASCADE;
