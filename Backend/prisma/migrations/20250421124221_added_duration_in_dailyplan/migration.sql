/*
  Warnings:

  - Added the required column `duration` to the `DailyPlanner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyPlanner" ADD COLUMN     "duration" INTEGER NOT NULL;
