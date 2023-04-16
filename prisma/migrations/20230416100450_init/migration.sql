/*
  Warnings:

  - Added the required column `gwiazdki` to the `Ocena` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zaakceptowana` to the `Ocena` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Kategoria" (
    "nazwa" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Produkt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nazwa" TEXT NOT NULL,
    "opis" TEXT,
    "zdjecie" TEXT,
    "kategoriaId" TEXT NOT NULL,
    "wlascicielId" INTEGER NOT NULL,
    "stan" INTEGER NOT NULL,
    "cena" REAL NOT NULL,
    CONSTRAINT "Produkt_kategoriaId_fkey" FOREIGN KEY ("kategoriaId") REFERENCES "Kategoria" ("nazwa") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Produkt_wlascicielId_fkey" FOREIGN KEY ("wlascicielId") REFERENCES "Uzytkownik" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Koszyk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produktId" INTEGER NOT NULL,
    "uzytkownikId" INTEGER NOT NULL,
    "ile" INTEGER NOT NULL,
    "ostatnioprzypomniany" DATETIME NOT NULL,
    CONSTRAINT "Koszyk_produktId_fkey" FOREIGN KEY ("produktId") REFERENCES "Produkt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Koszyk_uzytkownikId_fkey" FOREIGN KEY ("uzytkownikId") REFERENCES "Uzytkownik" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Zakup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produktId" INTEGER NOT NULL,
    "uzytkownikId" INTEGER NOT NULL,
    "ile" INTEGER NOT NULL,
    "cena" REAL NOT NULL,
    "ostatnioprzypomniany" DATETIME NOT NULL,
    CONSTRAINT "Zakup_produktId_fkey" FOREIGN KEY ("produktId") REFERENCES "Produkt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Zakup_uzytkownikId_fkey" FOREIGN KEY ("uzytkownikId") REFERENCES "Uzytkownik" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ocena" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ktoId" INTEGER NOT NULL,
    "komuId" INTEGER NOT NULL,
    "gwiazdki" INTEGER NOT NULL,
    "zaakceptowana" BOOLEAN NOT NULL,
    CONSTRAINT "Ocena_ktoId_fkey" FOREIGN KEY ("ktoId") REFERENCES "Uzytkownik" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ocena_komuId_fkey" FOREIGN KEY ("komuId") REFERENCES "Uzytkownik" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ocena" ("id", "komuId", "ktoId") SELECT "id", "komuId", "ktoId" FROM "Ocena";
DROP TABLE "Ocena";
ALTER TABLE "new_Ocena" RENAME TO "Ocena";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Kategoria_nazwa_key" ON "Kategoria"("nazwa");
