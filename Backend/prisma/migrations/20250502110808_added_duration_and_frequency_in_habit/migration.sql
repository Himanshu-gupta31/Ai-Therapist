/*
  Warnings:

  - Made the column `duration` on table `Habit` required. This step will fail if there are existing NULL values in that column.
  - Made the column `frequency` on table `Habit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Habit" ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "frequency" SET NOT NULL;
