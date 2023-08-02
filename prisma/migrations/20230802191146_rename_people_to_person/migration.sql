/*
  Warnings:

  - You are about to drop the `_PersonToTree` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PersonToTree" DROP CONSTRAINT "_PersonToTree_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToTree" DROP CONSTRAINT "_PersonToTree_B_fkey";

-- AlterTable
ALTER TABLE "Person" RENAME CONSTRAINT "Person_pkey" TO "Person_pkey";

-- DropTable
DROP TABLE "_PersonToTree";

-- CreateTable
CREATE TABLE "_PersonToTree" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PersonToTree_AB_unique" ON "_PersonToTree"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonToTree_B_index" ON "_PersonToTree"("B");

-- RenameForeignKey
ALTER TABLE "Person" RENAME CONSTRAINT "Person_fatherId_fkey" TO "Person_fatherId_fkey";

-- RenameForeignKey
ALTER TABLE "Person" RENAME CONSTRAINT "Person_spouseId_fkey" TO "Person_spouseId_fkey";

-- RenameForeignKey
ALTER TABLE "Person" RENAME CONSTRAINT "Person_userId_fkey" TO "Person_userId_fkey";

-- AddForeignKey
ALTER TABLE "_PersonToTree" ADD CONSTRAINT "_PersonToTree_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToTree" ADD CONSTRAINT "_PersonToTree_B_fkey" FOREIGN KEY ("B") REFERENCES "Tree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Person_fatherId_key" RENAME TO "Person_fatherId_key";

-- RenameIndex
ALTER INDEX "Person_motherId_key" RENAME TO "Person_motherId_key";

-- RenameIndex
ALTER INDEX "Person_spouseId_key" RENAME TO "Person_spouseId_key";
