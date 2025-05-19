import { Response,Request } from "express";
import { prisma } from "../db/db";


export const addCoins=async(req:Request,res:Response)=>{
    try {
        const COIN_REWARD=2
        const user=(req as any).user
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized access" });
            return
         }
        const {habitId}=req.params;
        if (!habitId) {
            res.status(400).json({ message: "Habit ID is required" });
            return;
        }
        
        const getHabit=await prisma.habit.findUnique({
            where:{
                id:habitId
            },
            select:{
                lastCheckIn:true,
                habitName:true
            }
        })  
        const now=new Date()
        const today=now.toISOString().split("T")[0]

        if(!getHabit  || !getHabit.lastCheckIn){
            res.status(404).json({message:"No habit found"})
            return
        }
        const lastCheckedIn=getHabit?.lastCheckIn?.toISOString().split("T")[0]
        if(lastCheckedIn===today){
            const updatedCoins=await prisma.user.update({
                where:{
                    id:user.id
                },
                data:{
                    coins:{
                        increment:COIN_REWARD
                    }
                }
            })
            res.status(200).json({
                message: `✅ Coins added for completing '${getHabit?.habitName}'!`,
                newCoinBalance: updatedCoins.coins,
        })
    }else{
        res.status(400).json({ message: "Habit not checked in today. No coins added." });
        return
    }
    } catch (error) {
        console.error("Error adding coins:", error);
     res.status(500).json({ message: "Something went wrong while adding coins." });
    }
}