/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `ItemCalificable` table. All the data in the column will be lost.
  - Added the required column `chosenItemId` to the `BracketVote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ItemCalificable" DROP CONSTRAINT "ItemCalificable_categoriaId_fkey";

-- AlterTable
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='BracketVote' AND column_name='chosenItemId') THEN
        ALTER TABLE "BracketVote" ADD COLUMN "chosenItemId" TEXT NOT NULL DEFAULT '';
    END IF;
END $$;

-- AlterTable
ALTER TABLE "Calificacion" ADD COLUMN     "tablaId" TEXT;

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "ItemCalificable" DROP COLUMN "categoriaId",
ADD COLUMN     "juegoId" TEXT;

-- AlterTable
ALTER TABLE "Sorteo" ADD COLUMN     "externalUrl" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "numGanadores" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "VotacionBracket" ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "Tutorial" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "descripcion" TEXT,
    "dificultad" TEXT NOT NULL DEFAULT 'MEDIO',
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "juegoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "autor" TEXT,
    "autorUrl" TEXT,
    "imageCover" TEXT,
    "categoriaId" TEXT,
    "utilidadCount" INTEGER NOT NULL DEFAULT 0,
    "compartirCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Tutorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorialStep" (
    "id" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "image" TEXT,
    "tutorialId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TutorialStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TablaCalificacion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "image" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "juegoId" TEXT NOT NULL,
    "categoriaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TablaCalificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TablaItem" (
    "id" TEXT NOT NULL,
    "tablaId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "TablaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publicacion" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "enlace" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SorteoParticipante" (
    "id" TEXT NOT NULL,
    "sorteoId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "nombre" TEXT,
    "deviceId" TEXT,
    "trafficSource" TEXT,

    CONSTRAINT "SorteoParticipante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SorteoEntry" (
    "id" TEXT NOT NULL,
    "participanteId" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "origen" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SorteoEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SorteoTask" (
    "id" TEXT NOT NULL,
    "sorteoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "obligatorio" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SorteoTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipanteTask" (
    "id" TEXT NOT NULL,
    "participanteId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "verificada" BOOLEAN NOT NULL DEFAULT false,
    "evidenciaUrl" TEXT,
    "evidenciaTexto" TEXT,
    "completadaAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipanteTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SorteoWinner" (
    "id" TEXT NOT NULL,
    "sorteoId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailManual" TEXT,
    "nombreManual" TEXT,

    CONSTRAINT "SorteoWinner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordWebhook" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "webhookUrl" TEXT NOT NULL,
    "channelId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscordWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordPublication" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "bracketId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "messageId" TEXT,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscordPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '@AJDREWGameplays',
    "apiKey" TEXT NOT NULL,
    "apiSecret" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "accessSecret" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "XAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XPublication" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "bracketId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "tweetId" TEXT,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Mi Página de Facebook',
    "pageId" TEXT NOT NULL,
    "pageAccessToken" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacebookAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstagramAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '@AJDREWGameplays',
    "igAccountId" TEXT NOT NULL,
    "pageAccessToken" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaPublication" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "facebookAccountId" TEXT,
    "instagramAccountId" TEXT,
    "bracketId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "postId" TEXT,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetaPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Mi Canal de YouTube',
    "channelId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiryDate" BIGINT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubePublication" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "bracketId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "videoId" TEXT,
    "imageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YoutubePublication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tutorial_slug_key" ON "Tutorial"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TablaCalificacion_slug_key" ON "TablaCalificacion"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TablaItem_tablaId_itemId_key" ON "TablaItem"("tablaId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "SorteoParticipante_sorteoId_usuarioId_key" ON "SorteoParticipante"("sorteoId", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "SorteoParticipante_sorteoId_email_key" ON "SorteoParticipante"("sorteoId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "SorteoParticipante_sorteoId_deviceId_key" ON "SorteoParticipante"("sorteoId", "deviceId");

-- CreateIndex
CREATE INDEX "SorteoEntry_participanteId_idx" ON "SorteoEntry"("participanteId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipanteTask_participanteId_taskId_key" ON "ParticipanteTask"("participanteId", "taskId");

-- AddForeignKey
ALTER TABLE "Tutorial" ADD CONSTRAINT "Tutorial_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutorial" ADD CONSTRAINT "Tutorial_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialStep" ADD CONSTRAINT "TutorialStep_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCalificable" ADD CONSTRAINT "ItemCalificable_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TablaCalificacion" ADD CONSTRAINT "TablaCalificacion_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TablaCalificacion" ADD CONSTRAINT "TablaCalificacion_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TablaItem" ADD CONSTRAINT "TablaItem_tablaId_fkey" FOREIGN KEY ("tablaId") REFERENCES "TablaCalificacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TablaItem" ADD CONSTRAINT "TablaItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemCalificable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_tablaId_fkey" FOREIGN KEY ("tablaId") REFERENCES "TablaCalificacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorteoParticipante" ADD CONSTRAINT "SorteoParticipante_sorteoId_fkey" FOREIGN KEY ("sorteoId") REFERENCES "Sorteo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorteoParticipante" ADD CONSTRAINT "SorteoParticipante_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorteoEntry" ADD CONSTRAINT "SorteoEntry_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "SorteoParticipante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorteoTask" ADD CONSTRAINT "SorteoTask_sorteoId_fkey" FOREIGN KEY ("sorteoId") REFERENCES "Sorteo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipanteTask" ADD CONSTRAINT "ParticipanteTask_participanteId_fkey" FOREIGN KEY ("participanteId") REFERENCES "SorteoParticipante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipanteTask" ADD CONSTRAINT "ParticipanteTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "SorteoTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorteoWinner" ADD CONSTRAINT "SorteoWinner_sorteoId_fkey" FOREIGN KEY ("sorteoId") REFERENCES "Sorteo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SorteoWinner" ADD CONSTRAINT "SorteoWinner_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordPublication" ADD CONSTRAINT "DiscordPublication_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "DiscordWebhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordPublication" ADD CONSTRAINT "DiscordPublication_bracketId_fkey" FOREIGN KEY ("bracketId") REFERENCES "VotacionBracket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XPublication" ADD CONSTRAINT "XPublication_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "XAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XPublication" ADD CONSTRAINT "XPublication_bracketId_fkey" FOREIGN KEY ("bracketId") REFERENCES "VotacionBracket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaPublication" ADD CONSTRAINT "MetaPublication_facebookAccountId_fkey" FOREIGN KEY ("facebookAccountId") REFERENCES "FacebookAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaPublication" ADD CONSTRAINT "MetaPublication_instagramAccountId_fkey" FOREIGN KEY ("instagramAccountId") REFERENCES "InstagramAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaPublication" ADD CONSTRAINT "MetaPublication_bracketId_fkey" FOREIGN KEY ("bracketId") REFERENCES "VotacionBracket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YoutubePublication" ADD CONSTRAINT "YoutubePublication_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "YoutubeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YoutubePublication" ADD CONSTRAINT "YoutubePublication_bracketId_fkey" FOREIGN KEY ("bracketId") REFERENCES "VotacionBracket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
