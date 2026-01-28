-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "juegoId" TEXT;

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

-- CreateIndex
CREATE UNIQUE INDEX "Juego_slug_key" ON "Juego"("slug");

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE SET NULL ON UPDATE CASCADE;
