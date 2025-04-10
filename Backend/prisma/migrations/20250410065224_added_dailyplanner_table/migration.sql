-- AlterTable
ALTER TABLE "User" ALTER COLUMN "checkInDates" SET DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "DailyPlanner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "planName" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "DailyPlanner_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyPlanner" ADD CONSTRAINT "DailyPlanner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
