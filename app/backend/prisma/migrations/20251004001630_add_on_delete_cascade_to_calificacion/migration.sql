-- items-calificables/prisma/migrations/20251004001630_add_on_delete_cascade_to_calificacion/migration.sql
-- DropForeignKey
ALTER TABLE "public"."Calificacion" DROP CONSTRAINT "Calificacion_itemId_fkey";

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemCalificable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
