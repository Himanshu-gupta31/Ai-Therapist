"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCalendarHabit = void 0;
const googleapis_1 = require("googleapis");
const db_1 = require("../db/db");
const googleConfig_1 = require("../utils/googleConfig");
const createCalendarHabit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { habitName, startingTime, duration } = req.body;
        if (!habitName || !startingTime || !duration) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const userexist = yield db_1.prisma.user.findUnique({
            where: { id: user.id },
        });
        if (!userexist || !userexist.access_token || !userexist.refresh_token) {
            res.status(401).json({ message: "User not authenticated with Google" });
            return;
        }
        googleConfig_1.oauth2client.setCredentials({
            access_token: userexist.access_token,
            refresh_token: userexist.refresh_token,
        });
        const calendar = googleapis_1.google.calendar({ version: "v3", auth: googleConfig_1.oauth2client });
        const now = new Date();
        const [hours, minutes] = startingTime.split(":").map(Number);
        // Create start and end times in local time
        const startDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
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
        const response = yield calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
        });
        res.status(200).json({
            message: "Google Calendar event created",
            eventId: response.data.id,
        });
    }
    catch (error) {
        console.error("Error creating calendar event:", error);
        res.status(500).json({
            message: "Failed to create calendar event",
            error: error.message,
        });
    }
});
exports.createCalendarHabit = createCalendarHabit;
