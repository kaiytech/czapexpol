/*
  Warnings:

  - You are about to drop the column `ostatnioprzypomniany` on the `Zakup` table. All the data in the column will be lost.
  - Added the required column `dataZakupu` to the `Zakup` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Zakup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produktId" INTEGER NOT NULL,
    "uzytkownikId" INTEGER NOT NULL,
    "ile" INTEGER NOT NULL,
    "cena" REAL NOT NULL,
    "dataZakupu" DATETIME NOT NULL,
    CONSTRAINT "Zakup_produktId_fkey" FOREIGN KEY ("produktId") REFERENCES "Produkt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Zakup_uzytkownikId_fkey" FOREIGN KEY ("uzytkownikId") REFERENCES "Uzytkownik" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Zakup" ("cena", "id", "ile", "produktId", "uzytkownikId") SELECT "cena", "id", "ile", "produktId", "uzytkownikId" FROM "Zakup";
DROP TABLE "Zakup";
ALTER TABLE "new_Zakup" RENAME TO "Zakup";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
