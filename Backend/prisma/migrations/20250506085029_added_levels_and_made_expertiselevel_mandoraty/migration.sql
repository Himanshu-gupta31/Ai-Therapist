/*
  Warnings:

  - Added the required column `level` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Made the column `expertiselevel` on table `Habit` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "LevelsType" AS ENUM ('Very_Easy', 'Easy', 'Medium', 'Hard', 'Very_Hard');

-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "level" "LevelsType" NOT NULL,
ALTER COLUMN "expertiselevel" SET NOT NULL;

-- DropEnum
DROP TYPE "Levels";
