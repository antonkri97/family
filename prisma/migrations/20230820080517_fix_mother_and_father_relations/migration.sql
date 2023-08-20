-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
