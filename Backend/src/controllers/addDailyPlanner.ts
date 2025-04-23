import { Response,Request } from "express";
import { prisma } from "../db/db";

export const addDailyPlan=async(req:Request,res:Response)=>{
    try {
        const user=(req as any).user
        if(!user || !user.id){
            res.status(401).json({message:"Unauthorized access"})
            return
        }
        const {date,planName,startingtime,priority,category,description,endtime}=req.body;
        if(!date || !planName || !startingtime || !priority || !category || !endtime){
            res.status(402).json({message:"Required field must be filled"})
            return;
        }

        const addPlan=await prisma.dailyPlanner.create({
            data:{
                date:new Date(date),
                description:description,
                planName:planName,
                startingtime:startingtime,
                priority:priority,
                category:category,
                userId:user.id,
                endtime:endtime
            }
        })
        if(!addPlan){
            res.status(403).json({message:"Daily Plan failed to add"})
        }
        res.status(200).json({message:"Daily Plan added succesfully",plan:addPlan})
    } catch (error) {
        console.error("Error adding daily plan:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}
