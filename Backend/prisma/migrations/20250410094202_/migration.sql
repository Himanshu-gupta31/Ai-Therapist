/*
  Warnings:

  - A unique constraint covering the columns `[userId,date,time]` on the table `DailyPlanner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DailyPlanner_userId_date_time_key" ON "DailyPlanner"("userId", "date", "time");
