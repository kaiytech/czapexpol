-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Uzytkownik" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "pin" INTEGER,
    "token" TEXT,
    "loginToken" TEXT,
    "imienazwisko" TEXT NOT NULL,
    "adres" TEXT NOT NULL,
    "czysprzedawca" BOOLEAN NOT NULL,
    "czyAdmin" BOOLEAN NOT NULL,
    "aktywacja" TEXT NOT NULL DEFAULT '0'
);
INSERT INTO "new_Uzytkownik" ("adres", "czyAdmin", "czysprzedawca", "id", "imienazwisko", "loginToken", "mail", "password", "pin", "token") SELECT "adres", "czyAdmin", "czysprzedawca", "id", "imienazwisko", "loginToken", "mail", "password", "pin", "token" FROM "Uzytkownik";
DROP TABLE "Uzytkownik";
ALTER TABLE "new_Uzytkownik" RENAME TO "Uzytkownik";
CREATE UNIQUE INDEX "Uzytkownik_mail_key" ON "Uzytkownik"("mail");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
