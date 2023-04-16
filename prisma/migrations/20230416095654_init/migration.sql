/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Uzytkownik" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "pin" INTEGER,
    "token" TEXT,
    "imienazwisko" TEXT NOT NULL,
    "adres" TEXT NOT NULL,
    "czysprzedawca" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Ocena" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ktoId" INTEGER NOT NULL,
    "komuId" INTEGER NOT NULL,
    CONSTRAINT "Ocena_ktoId_fkey" FOREIGN KEY ("ktoId") REFERENCES "Uzytkownik" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ocena_komuId_fkey" FOREIGN KEY ("komuId") REFERENCES "Uzytkownik" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Uzytkownik_mail_key" ON "Uzytkownik"("mail");
