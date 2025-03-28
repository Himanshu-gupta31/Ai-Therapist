import { Response,Request } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/db";

export const updatedStreak = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
       res.status(400).json({ message: "Unauthorized Access" });
       return
    }

    const checkuser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!checkuser) {
       res.status(404).json({ message: "User not found." });
       return
    }

    const now = new Date();
    const todayUTC = now.toISOString().split("T")[0];
    const lastCheckInUTC = checkuser.lastCheckIn
      ? new Date(checkuser.lastCheckIn).toISOString().split("T")[0]
      : null;

    let updatedStreak = checkuser.streak || 0;
    let updatedLongestStreak = checkuser.longestStreak || 0;

    if (!lastCheckInUTC || new Date(lastCheckInUTC) < new Date(todayUTC)) {
      updatedStreak = 1; // Reset streak if it's a new day or first check-in
    } else if (lastCheckInUTC !== todayUTC) {
      updatedStreak += 1; // Increase streak only if it's a consecutive check-in
    }

    updatedLongestStreak = Math.max(updatedLongestStreak, updatedStreak);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        streak: updatedStreak,
        longestStreak: updatedLongestStreak,
        lastCheckIn: now,
        checkInDates: {
          set: Array.from(new Set([...checkuser.checkInDates, todayUTC])),
        },
      },
    });

    res.status(200).json({
      message: "Streak Updated Successfully",
      streak: updatedStreak,
      longestStreak: updatedLongestStreak,
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getStreak=async(req:Request,res:Response)=>{
  try {
    const user=(req as any).user
    if(!user){
      res.status(400).json({message:"Unauthorized Access"})
  }
  const findUser=await prisma.user.findUnique({
    where:{
      id:user.id
    },select:{
      longestStreak:true,
      streak:true,
      lastCheckIn:true,
      checkInDates:true
    }
  });
  if(!findUser){
    res.status(401).json({message:"User not found"})
  }
  const formattedUser = {
    longestStreak: findUser?.longestStreak,
    streak: findUser?.streak,
    lastCheckIn: findUser?.lastCheckIn
      ? new Date(findUser?.lastCheckIn).toISOString().split("T")[0]
      : null,
    checkInDates: findUser?.checkInDates.map((date) =>
      new Date(date).toISOString().split("T")[0]
    ),
  };
  
  res.status(200).json({formattedUser})
  } catch (error) {
    res.status(500).json({ message: "Error fetching streak", error });
    
  }
}