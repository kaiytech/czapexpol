/*
  Warnings:

  - Made the column `czyAdmin` on table `Uzytkownik` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Uzytkownik" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "pin" INTEGER,
    "token" TEXT,
    "imienazwisko" TEXT NOT NULL,
    "adres" TEXT NOT NULL,
    "czysprzedawca" BOOLEAN NOT NULL,
    "czyAdmin" BOOLEAN NOT NULL
);
INSERT INTO "new_Uzytkownik" ("adres", "czyAdmin", "czysprzedawca", "id", "imienazwisko", "mail", "password", "pin", "token") SELECT "adres", "czyAdmin", "czysprzedawca", "id", "imienazwisko", "mail", "password", "pin", "token" FROM "Uzytkownik";
DROP TABLE "Uzytkownik";
ALTER TABLE "new_Uzytkownik" RENAME TO "Uzytkownik";
CREATE UNIQUE INDEX "Uzytkownik_mail_key" ON "Uzytkownik"("mail");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
