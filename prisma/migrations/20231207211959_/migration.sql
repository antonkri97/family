/*
  Warnings:

  - You are about to drop the `Tree` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Ex` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PersonToTree` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tree" DROP CONSTRAINT "Tree_userId_fkey";

-- DropForeignKey
ALTER TABLE "_Ex" DROP CONSTRAINT "_Ex_A_fkey";

-- DropForeignKey
ALTER TABLE "_Ex" DROP CONSTRAINT "_Ex_B_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToTree" DROP CONSTRAINT "_PersonToTree_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToTree" DROP CONSTRAINT "_PersonToTree_B_fkey";

-- DropIndex
DROP INDEX "Person_spouseId_key";

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "avatar" TEXT;

-- DropTable
DROP TABLE "Tree";

-- DropTable
DROP TABLE "_Ex";

-- DropTable
DROP TABLE "_PersonToTree";
