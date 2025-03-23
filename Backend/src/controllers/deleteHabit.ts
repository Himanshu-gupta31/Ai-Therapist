import { Request,Response } from "express";
import { prisma } from "../db/db";

export const deleteTodo=async(req:Request,res:Response)=>{
    try {
        const user=(req as any).user;
        const {id}=req.params;
        console.log("User",user?.id)
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        const todo=await prisma.habit.findUnique({
            where:{
                id:id
            }
        })
        if(todo?.userId!==user.id){
            res.status(400).json({
                message:"Unauthorized access"
            })
        }
        const deletedTodo=await prisma.habit.delete({
            where:{
                id:id,
                
            }
        })
         res.status(200).json({ 
            message: "Todo deleted successfully", 
            deletedTodo 
        });
    } catch (error) {
        console.error("Error deleting todo:", error);
         res.status(500).json({ message: "Internal server error" });
         return
    }
}