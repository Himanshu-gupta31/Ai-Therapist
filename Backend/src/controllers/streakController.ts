import { Response, Request } from "express";
import { prisma } from "../db/db";

export const updatedStreak = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const habitId = req.params.habitId;

    if (!user) {
      res.status(400).json({ message: "Unauthorized Access" });
      return;
    }

    if (!habitId) {
      res.status(400).json({ message: "Habit ID is required" });
      return;
    }

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit || habit.userId !== user.id) {
      res.status(404).json({ message: "Habit not found" });
      return;
    }

    const now = new Date();
    const todayUTC = now.toISOString().split("T")[0];

    if (habit.checkInDates.includes(todayUTC)) {
      res.status(200).json({
        message: "Already checked in today",
        streak: habit.streak,
        longestStreak: habit.longestStreak,
        checkInDates:habit.checkInDates
      });
      return;
    }

    const sortedDates = [...habit.checkInDates].sort();
    let newStreak = 1;

    if (sortedDates.length > 0) {
      const lastDateStr = sortedDates[sortedDates.length - 1];
      const lastDate = new Date(lastDateStr);
      const today = new Date(todayUTC);

      const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        newStreak = (habit.streak || 1) + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    const updatedCheckInDates = Array.from(
      new Set([...habit.checkInDates, todayUTC])
    );

    const updatedHabit = await prisma.habit.update({
      where: { id: habit.id },
      data: {
        streak: newStreak,
        longestStreak: Math.max(habit.longestStreak || 0, newStreak),
        lastCheckIn: now,
        checkInDates: { set: updatedCheckInDates },
      },
    });

    res.status(200).json({
      message: "Streak Updated Successfully",
      habitId: updatedHabit.id,
      streak: updatedHabit.streak,
      longestStreak: updatedHabit.longestStreak,
      checkIndates:updatedHabit.checkInDates
      
    });

  } catch (error) {
    console.error("Error updating habit streak:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getStreak = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
       res.status(400).json({ message: "Unauthorized Access" });
       return
    }

    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        habitName: true,
        streak: true,
        longestStreak: true,
        lastCheckIn: true,
        checkInDates: true,
      },
    });

    if (!habits || habits.length === 0) {
       res.status(404).json({ message: "No habits found" });
       return
    }

    const formattedHabits = habits.map((habit) => ({
      habitId: habit.id,
      habitName: habit.habitName,
      streak: habit.streak,
      longestStreak: habit.longestStreak,
      lastCheckIn: habit.lastCheckIn
        ? new Date(habit.lastCheckIn).toISOString().split("T")[0]
        : null,
      checkInDates: habit.checkInDates.map((date) =>
        new Date(date).toISOString().split("T")[0]
      ),
    }));

    res.status(200).json({ habits: formattedHabits });
  } catch (error) {
    console.error("Error fetching streaks:", error);
    res.status(500).json({ message: "Error fetching streaks", error });
  }
};
