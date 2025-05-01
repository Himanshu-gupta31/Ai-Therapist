import { Response,Request } from "express";
import { prisma } from "../db/db";
export const QuoteType=async(req:Request,res:Response)=>{
      try {
        const {habitId}=req.params
        const user=(req as any).user

        if (!user) {
            res.status(400).json({ message: "Unauthorized Access" });
            return;
          }
      
          if (!habitId) {
            res.status(400).json({ message: "Habit ID is required" });
            return;
          }
          const habit=await prisma.habit.findUnique({
            where:{
                id:habitId
            }
          })
          const lastCheckIn=habit?.lastCheckIn?.toISOString().split("T")[0]
          const now=new Date();
          const today=now.toISOString().split("T")[0]
          if(lastCheckIn !== today){
            const roastQuotes=await prisma.quote.findMany({
                where:{
                    type:"ROAST"
                }
            })
            if(roastQuotes.length===0){
                res.status(404).json({ message: "No roast quotes found" });
                return;
            }
            const randomIndex=Math.floor(Math.random()* roastQuotes.length)
            const randomRoast=roastQuotes[randomIndex]
            res.status(200).json({ quote: randomRoast })
            return
          }
          else{
            const motivationalQuotes=await prisma.quote.findMany({
                where:{
                    type:"MOTIVATIONAL"
                }
            })
            if(motivationalQuotes.length===0){
                res.status(404).json({ message: "No motivational quotes found" });
                return;
            }
            const randomIndex=Math.floor(Math.random() * motivationalQuotes.length)
            const randomRoast=motivationalQuotes[randomIndex]
            res.status(200).json({ quote: randomRoast })
            return
          }

      } catch (error) {
        console.error("Error fetching quote:", error);
         res.status(500).json({ message: "Something went wrong" });
         return
      }
}