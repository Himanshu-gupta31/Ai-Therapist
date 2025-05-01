-- CreateTable
CREATE TABLE "_HabitQuotes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HabitQuotes_AB_unique" ON "_HabitQuotes"("A", "B");

-- CreateIndex
CREATE INDEX "_HabitQuotes_B_index" ON "_HabitQuotes"("B");

-- AddForeignKey
ALTER TABLE "_HabitQuotes" ADD CONSTRAINT "_HabitQuotes_A_fkey" FOREIGN KEY ("A") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HabitQuotes" ADD CONSTRAINT "_HabitQuotes_B_fkey" FOREIGN KEY ("B") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
