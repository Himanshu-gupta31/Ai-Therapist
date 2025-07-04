import { Request,Response } from "express";
import { prisma } from "../db/db";

export const getHabit=async(req:Request,res:Response)=>{
    try {
        const user=(req as any).user;
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        
        const getHabit=await prisma.habit.findMany({
            where:{
                userId:user.id
            },
            select:{
                habitName:true,
                description:true,
                id:true,
                frequency:true,
                duration:true,
                goal:true,
                expertiselevel:true

            }
        })
        res.status(200).json({ getHabit });
        return;
    } catch (error) {
        console.error("Error fetching habits:", error);
        res.status(500).json({ message: "Internal server error" });
        return
    }
}