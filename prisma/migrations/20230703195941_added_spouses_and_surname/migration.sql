/*
  Warnings:

  - You are about to drop the column `secondName` on the `People` table. All the data in the column will be lost.
  - Added the required column `secondNameId` to the `People` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "SecondName" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_sposes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_sposes_A_fkey" FOREIGN KEY ("A") REFERENCES "People" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_sposes_B_fkey" FOREIGN KEY ("B") REFERENCES "People" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_People" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "secondNameId" TEXT NOT NULL,
    "thirdName" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "genderId" TEXT NOT NULL,
    "fatherId" TEXT,
    "motherId" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "People_secondNameId_fkey" FOREIGN KEY ("secondNameId") REFERENCES "SecondName" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "People_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "People_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "People" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "People_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_People" ("bio", "birthday", "createdAt", "fatherId", "firstName", "genderId", "id", "motherId", "thirdName", "updatedAt", "userId") SELECT "bio", "birthday", "createdAt", "fatherId", "firstName", "genderId", "id", "motherId", "thirdName", "updatedAt", "userId" FROM "People";
DROP TABLE "People";
ALTER TABLE "new_People" RENAME TO "People";
CREATE UNIQUE INDEX "People_fatherId_key" ON "People"("fatherId");
CREATE UNIQUE INDEX "People_motherId_key" ON "People"("motherId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_sposes_AB_unique" ON "_sposes"("A", "B");

-- CreateIndex
CREATE INDEX "_sposes_B_index" ON "_sposes"("B");
