import { Request, Response } from "express";
import { prisma } from "../db/db";
import { LevelsType } from "@prisma/client";
import { chatSession } from "../services/aiModel";

export const progressiveTarget = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(400).json({ message: "Unauthorized Access" });
      return;
    }

    const { habitId } = req.params;
    if (!habitId) {
      res.status(400).json({ message: "Habit ID is required" });
      return;
    }

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
      select: {
        habitName: true,
        checkInDates: true,
        level: true,
        levelUpdatedAt: true,
        goal: true,
      },
    });

    if (!habit) {
      res.status(404).json({ message: "Habit not found" });
      return;
    }

    const { habitName, goal, level, checkInDates, levelUpdatedAt } = habit;

    if (!goal) {
      res.status(500).json({ message: "Goal not found for habit." });
      return;
    }

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const updatedAt = levelUpdatedAt ?? new Date(0);
    const updatedAtDate = updatedAt.toISOString().split("T")[0];

    const filteredCheckin = checkInDates.filter((dateStr) => {
      const checkInDate = new Date(dateStr).toISOString().split("T")[0];
      return checkInDate > updatedAtDate;
    });

    const getLastNDays = (n: number): string[] => {
      const days: string[] = [];
      for (let i = n - 1; i >= 0; i--) {
        const day = new Date(now);
        day.setUTCDate(day.getUTCDate() - i);
        days.push(day.toISOString().split("T")[0]);
      }
      return days;
    };

    const last7days = getLastNDays(7);
    const last14days = getLastNDays(14);
    const last21days = getLastNDays(21);
    const last28days = getLastNDays(28);

    const last7CheckIns = last7days.filter((d) => filteredCheckin.includes(d));
    const last14CheckIns = last14days.filter((d) =>
      filteredCheckin.includes(d)
    );

    let newLevel: LevelsType | null = null;

    if (level === LevelsType.Very_Easy && last7CheckIns.length >= 5) {
      newLevel = LevelsType.Easy;
    } else if (level === LevelsType.Easy && last14CheckIns.length >= 10) {
      newLevel = LevelsType.Medium;
    } else if (level === LevelsType.Medium && last21days.length >= 15) {
      newLevel = LevelsType.Hard;
    } else if (level === LevelsType.Hard && last28days.length >= 20) {
      newLevel = LevelsType.Very_Hard;
    }

    // Construct the message for AI in all cases
    const message = `Habit Name: ${habitName}
Goal: ${goal}
Current Level: ${newLevel ?? level}`;

    const result = await chatSession.sendMessage(message);
    const responseText = await result.response.text();

    if (newLevel) {
      await prisma.habit.update({
        where: { id: habitId },
        data: {
          level: newLevel,
          levelUpdatedAt: today,
        },
      });

      res.status(200).json({
        message: `Habit level upgraded to ${newLevel}`,
        level: newLevel,
        filteredCheckin,
        responseText,
      });
    } else {
      res.status(200).json({
        message: "No level change",
        level,
        filteredCheckin,
        responseText,
      });
    }
  } catch (error) {
    console.error("Error in progressiveTarget:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
