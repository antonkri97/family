/*
  Warnings:

  - You are about to drop the column `gender` on the `People` table. All the data in the column will be lost.
  - Added the required column `genderId` to the `People` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Gender" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_People" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "secondName" TEXT NOT NULL,
    "thirdName" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "genderId" TEXT NOT NULL,
    "fatherId" TEXT,
    "motherId" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "People_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "People_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "People" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "People_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_People" ("bio", "birthday", "createdAt", "firstName", "id", "secondName", "thirdName", "updatedAt", "userId") SELECT "bio", "birthday", "createdAt", "firstName", "id", "secondName", "thirdName", "updatedAt", "userId" FROM "People";
DROP TABLE "People";
ALTER TABLE "new_People" RENAME TO "People";
CREATE UNIQUE INDEX "People_fatherId_key" ON "People"("fatherId");
CREATE UNIQUE INDEX "People_motherId_key" ON "People"("motherId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Gender_name_key" ON "Gender"("name");
