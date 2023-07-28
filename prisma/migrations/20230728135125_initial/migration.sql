-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tree" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Tree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "People" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "secondName" TEXT NOT NULL,
    "thirdName" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "fatherId" TEXT,
    "motherId" TEXT,
    "spouseId" TEXT,
    "bio" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "People_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Ex" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PeopleToTree" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "People_fatherId_key" ON "People"("fatherId");

-- CreateIndex
CREATE UNIQUE INDEX "People_motherId_key" ON "People"("motherId");

-- CreateIndex
CREATE UNIQUE INDEX "People_spouseId_key" ON "People"("spouseId");

-- CreateIndex
CREATE UNIQUE INDEX "_Ex_AB_unique" ON "_Ex"("A", "B");

-- CreateIndex
CREATE INDEX "_Ex_B_index" ON "_Ex"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PeopleToTree_AB_unique" ON "_PeopleToTree"("A", "B");

-- CreateIndex
CREATE INDEX "_PeopleToTree_B_index" ON "_PeopleToTree"("B");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tree" ADD CONSTRAINT "Tree_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "People" ADD CONSTRAINT "People_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "People"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "People" ADD CONSTRAINT "People_spouseId_fkey" FOREIGN KEY ("spouseId") REFERENCES "People"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "People" ADD CONSTRAINT "People_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Ex" ADD CONSTRAINT "_Ex_A_fkey" FOREIGN KEY ("A") REFERENCES "People"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Ex" ADD CONSTRAINT "_Ex_B_fkey" FOREIGN KEY ("B") REFERENCES "People"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PeopleToTree" ADD CONSTRAINT "_PeopleToTree_A_fkey" FOREIGN KEY ("A") REFERENCES "People"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PeopleToTree" ADD CONSTRAINT "_PeopleToTree_B_fkey" FOREIGN KEY ("B") REFERENCES "Tree"("id") ON DELETE CASCADE ON UPDATE CASCADE;
