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
CREATE TABLE "Juego" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "image" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Juego_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "tipo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "juegoId" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemCalificable" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "juegoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,

    CONSTRAINT "ItemCalificable_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Calificacion" (
    "id" TEXT NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "ip" TEXT,
    "itemId" TEXT NOT NULL,
    "tablaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceId" TEXT,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
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
    "categoriaId" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "proximoCierreAt" TIMESTAMP(3),
    "rondaDuracion" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,

    CONSTRAINT "VotacionBracket_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "BracketVote" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chosenItemId" TEXT NOT NULL,

    CONSTRAINT "BracketVote_pkey" PRIMARY KEY ("id")
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
    "externalUrl" TEXT,
    "image" TEXT,
    "numGanadores" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Sorteo_pkey" PRIMARY KEY ("id")
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
    "name" TEXT NOT NULL DEFAULT 'Mi P├ígina de Facebook',
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

-- CreateTable
CREATE TABLE "JuegoSocialConfig" (
    "id" TEXT NOT NULL,
    "juegoId" TEXT NOT NULL,
    "discordEnabled" BOOLEAN NOT NULL DEFAULT true,
    "discordWebhookIds" TEXT[],
    "xEnabled" BOOLEAN NOT NULL DEFAULT true,
    "xAccountIds" TEXT[],
    "facebookEnabled" BOOLEAN NOT NULL DEFAULT true,
    "facebookAccountIds" TEXT[],
    "instagramEnabled" BOOLEAN NOT NULL DEFAULT true,
    "instagramAccountIds" TEXT[],
    "youtubeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "youtubeAccountIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JuegoSocialConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Juego_slug_key" ON "Juego"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tutorial_slug_key" ON "Tutorial"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TablaCalificacion_slug_key" ON "TablaCalificacion"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TablaItem_tablaId_itemId_key" ON "TablaItem"("tablaId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "VotacionBracket_slug_key" ON "VotacionBracket"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BracketVote_matchId_deviceId_key" ON "BracketVote"("matchId", "deviceId");

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

-- CreateIndex
CREATE UNIQUE INDEX "JuegoSocialConfig_juegoId_key" ON "JuegoSocialConfig"("juegoId");

-- AddForeignKey
ALTER TABLE "Tutorial" ADD CONSTRAINT "Tutorial_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutorial" ADD CONSTRAINT "Tutorial_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorialStep" ADD CONSTRAINT "TutorialStep_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemCalificable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_tablaId_fkey" FOREIGN KEY ("tablaId") REFERENCES "TablaCalificacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotacionBracket" ADD CONSTRAINT "VotacionBracket_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotacionBracket" ADD CONSTRAINT "VotacionBracket_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketMatch" ADD CONSTRAINT "BracketMatch_bracketId_fkey" FOREIGN KEY ("bracketId") REFERENCES "VotacionBracket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketMatch" ADD CONSTRAINT "BracketMatch_ganadorId_fkey" FOREIGN KEY ("ganadorId") REFERENCES "ItemCalificable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketMatch" ADD CONSTRAINT "BracketMatch_itemAId_fkey" FOREIGN KEY ("itemAId") REFERENCES "ItemCalificable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketMatch" ADD CONSTRAINT "BracketMatch_itemBId_fkey" FOREIGN KEY ("itemBId") REFERENCES "ItemCalificable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketVote" ADD CONSTRAINT "BracketVote_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "BracketMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sorteo" ADD CONSTRAINT "Sorteo_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "JuegoSocialConfig" ADD CONSTRAINT "JuegoSocialConfig_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE CASCADE ON UPDATE CASCADE;

