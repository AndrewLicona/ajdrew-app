-- Migration: Content Studio (Fase 1)
-- Fecha: 2026-10-04
-- Descripción: Crea las tablas SocialTemplate, SocialPublication y SocialAnalytics
--              que dan soporte al Content Studio (plantillas editables, trazabilidad
--              de publicaciones y métricas de redes sociales).

-- CreateTable
CREATE TABLE "SocialTemplate" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialPublication" (
    "id" TEXT NOT NULL,
    "evento" TEXT NOT NULL,
    "referenciaTipo" TEXT NOT NULL,
    "referenciaId" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "textoFinal" TEXT NOT NULL,
    "imageUrl" TEXT,
    "errorMsg" TEXT,
    "publicadoAt" TIMESTAMP(3),
    "programadoPara" TIMESTAMP(3),
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialAnalytics" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT,
    "plataforma" TEXT NOT NULL,
    "referenciaTipo" TEXT,
    "referenciaId" TEXT,
    "metricas" JSONB NOT NULL,
    "capturadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialTemplate_tipo_idx" ON "SocialTemplate"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "SocialTemplate_tipo_plataforma_key" ON "SocialTemplate"("tipo", "plataforma");

-- CreateIndex
CREATE INDEX "SocialPublication_estado_programadoPara_idx" ON "SocialPublication"("estado", "programadoPara");

-- CreateIndex
CREATE INDEX "SocialPublication_referenciaTipo_referenciaId_idx" ON "SocialPublication"("referenciaTipo", "referenciaId");

-- CreateIndex
CREATE INDEX "SocialPublication_plataforma_createdAt_idx" ON "SocialPublication"("plataforma", "createdAt");

-- CreateIndex
CREATE INDEX "SocialPublication_evento_idx" ON "SocialPublication"("evento");

-- CreateIndex
CREATE INDEX "SocialAnalytics_publicationId_idx" ON "SocialAnalytics"("publicationId");

-- CreateIndex
CREATE INDEX "SocialAnalytics_plataforma_capturadoEn_idx" ON "SocialAnalytics"("plataforma", "capturadoEn");

-- CreateIndex
CREATE INDEX "SocialAnalytics_referenciaTipo_referenciaId_idx" ON "SocialAnalytics"("referenciaTipo", "referenciaId");