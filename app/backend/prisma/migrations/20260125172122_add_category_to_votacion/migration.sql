-- AlterTable
ALTER TABLE "VotacionBracket" ADD COLUMN     "categoriaId" TEXT;

-- AddForeignKey
ALTER TABLE "VotacionBracket" ADD CONSTRAINT "VotacionBracket_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
