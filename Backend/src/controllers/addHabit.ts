import { Request, Response } from "express";
import { prisma } from "../db/db";

export const addHabit = async (req: Request, res: Response) => {
  try {
    const { habitName, description,frequency,duration,expertise } = req.body;//TODO 

    if (!habitName || !description || !frequency || !duration || !expertise ) {//TODO goal
       res.status(400).json({ message: "Must fill the required field to add Habit" });
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
        frequency,
        duration,
        expertiselevel:expertise,
        // goal
      },
    });

    res.status(201).json({ message: "Habit added successfully", habit: newHabit });
  } catch (error) {
    console.error("Error adding habit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
