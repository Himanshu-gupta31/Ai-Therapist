import { Response, Request } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/db";

export const updatedStreak = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(400).json({ message: "Unauthorized Access" });
      return;
    }

    const checkuser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!checkuser) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const now = new Date();
    const todayUTC = now.toISOString().split("T")[0];
    
    // If user already checked in today, don't modify the streak
    if (checkuser.checkInDates.includes(todayUTC)) {
      res.status(200).json({
        message: "Already checked in today",
        streak: checkuser.streak,
        longestStreak: checkuser.longestStreak,
      });
      return;
    }
    
    // Sort the check-in dates to properly calculate the streak
    const sortedDates = [...checkuser.checkInDates, todayUTC].sort();
    
    // Calculate the streak based on consecutive dates
    let currentStreak = 1;
    let maxStreak = 1;
    
    // Calculate streak by checking consecutive days
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i-1]);
      
      // Calculate difference in days
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day, increment streak
        currentStreak++;
      } else if (diffDays > 1) {
        // Break in streak, reset to 1
        currentStreak = 1;
      }
      // If diffDays is 0 (same day), we ignore it (prevents duplicate entries affecting streak)
      
      maxStreak = Math.max(maxStreak, currentStreak);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        streak: currentStreak,
        longestStreak: Math.max(checkuser.longestStreak || 0, currentStreak),
        lastCheckIn: now,
        checkInDates: {
          set: Array.from(new Set([...checkuser.checkInDates, todayUTC])),
        },
      },
    });

    res.status(200).json({
      message: "Streak Updated Successfully",
      streak: currentStreak,
      longestStreak: Math.max(checkuser.longestStreak || 0, currentStreak),
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStreak = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(400).json({ message: "Unauthorized Access" });
      return;
    }

    const findUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        longestStreak: true,
        streak: true,
        lastCheckIn: true,
        checkInDates: true,
      },
    });

    if (!findUser) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // Recalculate streak based on check-in dates to ensure accuracy
    const sortedDates = [...findUser.checkInDates].sort();
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i-1]);
      
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }

    const formattedUser = {
      longestStreak: findUser?.longestStreak,
      streak: currentStreak, // Use recalculated streak
      lastCheckIn: findUser?.lastCheckIn
        ? new Date(findUser?.lastCheckIn).toISOString().split("T")[0]
        : null,
      checkInDates: findUser?.checkInDates.map((date) =>
        new Date(date).toISOString().split("T")[0]
      ),
    };

    res.status(200).json({ formattedUser });
  } catch (error) {
    res.status(500).json({ message: "Error fetching streak", error });
  }
};