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
exports.createCalendar = void 0;
const googleapis_1 = require("googleapis");
const db_1 = require("../db/db");
const googleConfig_1 = require("../utils/googleConfig");
const createCalendar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { date, time, planName, description, endtime, startingtime } = req.body;
        const userexist = yield db_1.prisma.user.findUnique({
            where: {
                id: user.id
            }
        });
        if (!userexist || !userexist.access_token || !userexist.refresh_token) {
            res.status(401).json({ message: "User not authenticated with Google" });
            return;
        }
        googleConfig_1.oauth2client.setCredentials({
            access_token: userexist.access_token,
            refresh_token: userexist.refresh_token
        });
        const calendar = googleapis_1.google.calendar({ version: "v3", auth: googleConfig_1.oauth2client });
        const eventStart = new Date(`${date}T${startingtime}`);
        const eventEnd = new Date(`${date}T${endtime}`);
        const event = {
            summary: planName,
            description: description,
            start: { dateTime: eventStart.toISOString(), timeZone: "Asia/Kolkata" },
            end: { dateTime: eventEnd.toISOString(), timeZone: "Asia/Kolkata" }
        };
        const response = yield calendar.events.insert({
            calendarId: "primary",
            requestBody: event
        });
        res.status(200).json({ message: "Event created", eventLink: response.data.htmlLink });
        return;
    }
    catch (error) {
        console.log("Failed to load calendar events", error);
        res.status(500).json({ message: "Failed to create calendar event" });
        return;
    }
});
exports.createCalendar = createCalendar;
