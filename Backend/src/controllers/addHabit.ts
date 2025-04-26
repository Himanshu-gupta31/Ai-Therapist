import { Request, Response } from "express";
import { prisma } from "../db/db";

export const addHabit = async (req: Request, res: Response) => {
  try {
    const { habitName, description } = req.body;

    if (!habitName || !description) {
       res.status(400).json({ message: "Habit is needed to be added" });
       return
    }

    const user = (req as any).user;

    if (!user || !user.id) {
       res.status(401).json({ message: "Unauthorized access" });
       return
    }

    const newHabit = await prisma.habit.create({
      data: {
        habitName,
        description,
        userId: user.id,
        streak: 0,
        longestStreak: 0,
        lastCheckIn: null,
        checkInDates: [],
      },
    });

    res.status(201).json({ message: "Habit added successfully", habit: newHabit });
  } catch (error) {
    console.error("Error adding habit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
