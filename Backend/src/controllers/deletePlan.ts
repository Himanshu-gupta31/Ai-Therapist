import { Response,Request } from "express";
import { prisma } from "../db/db";


export const  deletePlan=async(req:Request,res:Response)=>{
    try {
        const user=(req as any).user
        const {id}=req.params
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        const findUser=await prisma.user.findUnique({
            where:{
                id:user.id
            }
        })
        const dailyPlan=await prisma.dailyPlanner.findUnique({
            where:{
                id:id
            }
        })
        if(findUser?.id!==dailyPlan?.userId){
            res.status(400).json({
                message:"Unauthorized access"
            })
        }
        const deletePlan=await prisma.dailyPlanner.delete({
            where:{
                id:id
            }
        })
        res.status(200).json({ 
            message: "Plan deleted successfully", 
            deletePlan
        });
    } catch (error) {
        console.error("Error deleting plan:", error);
         res.status(500).json({ message: "Internal server error" });
         return
    }
}