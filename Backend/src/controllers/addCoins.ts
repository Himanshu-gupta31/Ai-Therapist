import { Response,Request } from "express";
import { prisma } from "../db/db";


export const addCoins=async(res:Response,req:Request)=>{
    try {
        const COIN_REWARD = 2;
        const user = (req as any).user;
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        
        const { habitId } = req.params;
        if (!habitId) {
            res.status(400).json({ message: "Habit ID is required" });
            return;
        }
        
        const getHabit = await prisma.habit.findUnique({
            where: { id: habitId },
            select: { lastCheckIn: true, habitName: true }
        });
        
        if (!getHabit || !getHabit.lastCheckIn) {
            res.status(404).json({ message: "No habit found or habit not checked in" });
            return;
        }
        
        const lastCheckedIn = getHabit.lastCheckIn.toISOString().split("T")[0];
        const today = new Date().toISOString().split("T")[0];

        if(lastCheckedIn===today){
            const alreadyAwarded=await prisma.coins.findFirst({
                where:{
                    userId:user.id,
                    habitId:habitId,
                    dateAwarded:{
                        gte:new Date(new Date().setHours(0,0,0,0)),
                        lte:new Date(new Date().setHours(23, 59, 59, 999))
                    }
                }
            });
            if (alreadyAwarded) {
                return res.status(409).json({ message: "Coins already awarded today for this habit" });
            }
            
        }
    } catch (error) {
        
    }
}