import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma=new PrismaClient();

export const screenTime=async(req:Request,res:Response)=>{
    try {
        const {time}=req.body;
        if(!time){
            res.status(400).json({ message: "Need to add your screen time" });
            return;
        }
        const totalScreenTime=time*365*30
        res.status(200).json({totalScreenTime})
        return;
    } catch (error) {
        console.error("Error calculating screen time:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}

