-- CreateEnum
CREATE TYPE "ExpertiseType" AS ENUM ('Beginner', 'Intermediate', 'Expert');

-- CreateEnum
CREATE TYPE "Levels" AS ENUM ('Very_Easy', 'Easy', 'Medium', 'Hard', 'Very_Hard');

-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "expertiselevel" "ExpertiseType",
ADD COLUMN     "targets" TEXT;
