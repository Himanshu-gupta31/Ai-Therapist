import { Response,Request } from "express";
import {google} from "googleapis"
import { prisma } from "../db/db";
import { oauth2client } from "../utils/googleConfig";


export const createCalendar=async(req:Request,res:Response)=>{
    try {
        const user=(req as any).user
        const {date,time,planName,description}=req.body;
        
        console.log("User",user)
        const userexist=await prisma.user.findUnique({
            where:{
                id:user.id
            }
        })
        if (!userexist || !userexist.access_token || !userexist.refresh_token) {
             res.status(401).json({ message: "User not authenticated with Google" });
             return
          }
          oauth2client.setCredentials({
            access_token:userexist.access_token,
            refresh_token:userexist.refresh_token
          })

          const calendar=google.calendar({version:"v3",auth:oauth2client})

          const eventStart=new Date(`${date}T${time}`);
          const eventEnd=new Date(eventStart.getTime()+60*60*1000)

          const event={
            summary:planName,
            description:description,
            start:{dateTime: eventStart.toISOString(), timeZone: "Asia/Kolkata"},
            end:{dateTime: eventEnd.toISOString(), timeZone: "Asia/Kolkata"}
          }
          const response=await calendar.events.insert({
            calendarId:"primary",
            requestBody:event
          })
          res.status(200).json({message:"Event created",eventLink:response.data.htmlLink})
          return
    } catch (error) {
        console.log("Failed to load calendar events",error)
        res.status(500).json({message:"Failed to create calendar event"})
        return
    }
}