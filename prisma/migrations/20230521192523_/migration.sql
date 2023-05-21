/*
  Warnings:

  - A unique constraint covering the columns `[ktoId,komuId]` on the table `Ocena` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ocena_ktoId_komuId_key" ON "Ocena"("ktoId", "komuId");
