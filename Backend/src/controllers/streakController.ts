import { Response, Request } from "express";
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
    
    // Sort dates in ascending order
    const sortedDates = [...checkuser.checkInDates].sort();
    let newStreak = 1;
    
    if (sortedDates.length > 0) {
      // Compare most recent check-in with today
      const lastDateStr = sortedDates[sortedDates.length - 1];
      const lastDate = new Date(lastDateStr);
      const today = new Date(todayUTC);
      
      // Calculate difference in days
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day, increment streak
        newStreak = (checkuser.streak || 1) + 1;
      } else if (diffDays > 1) {
        // Missed days, reset streak
        newStreak = 1;
      }
    }
    
    const updatedCheckInDates = Array.from(new Set([...checkuser.checkInDates, todayUTC]));
    await prisma.user.update({
      where: { id: user.id },
      data: {
        streak: newStreak,
        longestStreak: Math.max(checkuser.longestStreak || 0, newStreak),
        lastCheckIn: now,
        checkInDates: {
          set: updatedCheckInDates,
        },
      },
    });
    
    res.status(200).json({
      message: "Streak Updated Successfully",
      streak: newStreak,
      longestStreak: Math.max(checkuser.longestStreak || 0, newStreak),
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

    const formattedUser = {
      longestStreak: findUser.longestStreak,
      streak: findUser.streak,
      lastCheckIn: findUser.lastCheckIn
        ? new Date(findUser.lastCheckIn).toISOString().split("T")[0]
        : null,
      checkInDates: findUser.checkInDates.map((date) =>
        new Date(date).toISOString().split("T")[0]
      ),
    };

    res.status(200).json({ formattedUser });
  } catch (error) {
    res.status(500).json({ message: "Error fetching streak", error });
  }
};