import { Request,Response } from "express";
import { prisma } from "../db/db";

const progressiveTarget=async(req:Request,res:Response)=>{
    try {
        const user=(req as any).user
        if (!user) {
            res.status(400).json({ message: "Unauthorized Access" });
            return;
          }
        const {habitId}=req.params
        if (!habitId) {
            res.status(400).json({ message: "Habit ID is required" });
            return;
        }
        const habit=await prisma.habit.findUnique({
            where:{
                id:habitId
            },
            select:{
                habitName:true,
                checkInDates:true,
                level: true,
            }
        }) 
        const checkInCount=habit?.checkInDates.length ?? 0
        let newLevel: string | null = null;
        if (checkInCount >= 27) {
            newLevel = "Very_Hard";
        } else if (checkInCount >= 19) {
            newLevel = "Hard";
        } else if (checkInCount >= 12) {
            newLevel = "Medium";
        } else if (checkInCount >= 5) {
            newLevel = "Easy";
        } 
        if(newLevel && newLevel !==habit?.level){
            await prisma.habit.update({
                where:{
                    id:habitId
                },
                data:{
                    
                },
            })
        }  
    } catch (error) {
        
    }
}