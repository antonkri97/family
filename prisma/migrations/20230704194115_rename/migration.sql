/*
  Warnings:

  - You are about to drop the column `name` on the `SecondName` table. All the data in the column will be lost.
  - Added the required column `secondName` to the `SecondName` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SecondName` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SecondName" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "secondName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SecondName_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SecondName" ("id") SELECT "id" FROM "SecondName";
DROP TABLE "SecondName";
ALTER TABLE "new_SecondName" RENAME TO "SecondName";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
