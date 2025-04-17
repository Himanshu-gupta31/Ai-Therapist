import { Response,Request } from "express";
import { prisma } from "../db/db";


export const fetchDailyPlan=async(req:Request,res:Response)=>{
    try {
        const user=(req as any).user
        if(!user || !user.id){
            res.status(401).json({message:"Unauthorized Access"})
            return;
        }
        const fetchPlan=await prisma.dailyPlanner.findMany({
            where:{
                userId:user.id
            },
            select:{
                id:true,
                date:true,
                planName:true,
                priority:true,
                description:true,
                time:true,
                category:true
            }
        })
        if(!fetchPlan){
            res.status(402).json({message:"Failed to fetch plam"})
            return
        }
        res.status(200).json({message:"Fetched plan successfully",fetchPlan:fetchPlan})
    } catch (error) {
        console.error("Error fetch daily plan:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}