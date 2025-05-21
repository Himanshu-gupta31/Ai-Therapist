import { Response,Request } from "express";
import { prisma } from "../db/db";

export const getAllCoins=async(req:Request,res:Response)=>{
    try {
        const user=(req as any).user
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized access" });
            return
         }
         const allCoins=await prisma.user.findUnique({
            where:{
                id:user.id
            },select:{
                email:true,
                totalCoins:true
            }
         })
         res.status(200).json({message:"Fetched All Coins succesfully",allCoins})
    } catch (error) {
        console.error("Error fetching coins:", error);
         res.status(500).json({
            message: "Internal server error",
        });
    }
}