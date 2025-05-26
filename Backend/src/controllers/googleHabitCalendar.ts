import { Request, Response } from "express";
import { google } from "googleapis";
import { prisma } from "../db/db";
import { oauth2client } from "../utils/googleConfig";

export const createCalendarHabit = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { habitName, startingTime, duration } = req.body;

    if (!habitName || !startingTime || !duration) {
       res.status(400).json({ message: "Missing required fields" });
       return
    }

    const userexist = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userexist || !userexist.access_token || !userexist.refresh_token) {
       res.status(401).json({ message: "User not authenticated with Google" });
       return 
    }

    oauth2client.setCredentials({
      access_token: userexist.access_token,
      refresh_token: userexist.refresh_token,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2client });

    const now = new Date();
    const [hours, minutes] = startingTime.split(":").map(Number);

    // Create start and end times in local time
    const startDateTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );

    const endDateTime = new Date(startDateTime.getTime() + duration * 60000); 

    const event = {
      summary: habitName,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      recurrence: ["RRULE:FREQ=DAILY"],
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    res.status(200).json({
      message: "Google Calendar event created",
      eventId: response.data.id,
    });
  } catch (error: any) {
    console.error("Error creating calendar event:", error);
    res.status(500).json({
      message: "Failed to create calendar event",
      error: error.message,
    });
  }
};
