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
exports.progressiveTarget = void 0;
const db_1 = require("../db/db");
const client_1 = require("@prisma/client");
const aiModel_1 = require("../services/aiModel");
const progressiveTarget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            res.status(400).json({ message: "Unauthorized Access" });
            return;
        }
        const { habitId } = req.params;
        if (!habitId) {
            res.status(400).json({ message: "Habit ID is required" });
            return;
        }
        const habit = yield db_1.prisma.habit.findUnique({
            where: { id: habitId },
            select: {
                habitName: true,
                checkInDates: true,
                level: true,
                levelUpdatedAt: true,
                goal: true,
                suggestedTarget: true,
            },
        });
        if (!habit) {
            res.status(404).json({ message: "Habit not found" });
            return;
        }
        const { habitName, goal, level, checkInDates, levelUpdatedAt, suggestedTarget } = habit;
        if (!goal) {
            res.status(500).json({ message: "Goal not found for habit." });
            return;
        }
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const updatedAt = levelUpdatedAt !== null && levelUpdatedAt !== void 0 ? levelUpdatedAt : new Date(0);
        const updatedAtDate = updatedAt.toISOString().split("T")[0];
        const filteredCheckin = checkInDates.filter((dateStr) => {
            const checkInDate = new Date(dateStr).toISOString().split("T")[0];
            return checkInDate > updatedAtDate;
        });
        const getLastNDays = (n) => {
            const days = [];
            for (let i = n - 1; i >= 0; i--) {
                const day = new Date(now);
                day.setUTCDate(day.getUTCDate() - i);
                days.push(day.toISOString().split("T")[0]);
            }
            return days;
        };
        const last7days = getLastNDays(7);
        const last14days = getLastNDays(14);
        const last21days = getLastNDays(21);
        const last28days = getLastNDays(28);
        const last7CheckIns = last7days.filter((d) => filteredCheckin.includes(d));
        const last14CheckIns = last14days.filter((d) => filteredCheckin.includes(d));
        let newLevel = null;
        if (level === client_1.LevelsType.Very_Easy && last7CheckIns.length >= 5) {
            newLevel = client_1.LevelsType.Easy;
        }
        else if (level === client_1.LevelsType.Easy && last14CheckIns.length >= 10) {
            newLevel = client_1.LevelsType.Medium;
        }
        else if (level === client_1.LevelsType.Medium && last21days.length >= 15) {
            newLevel = client_1.LevelsType.Hard;
        }
        else if (level === client_1.LevelsType.Hard && last28days.length >= 20) {
            newLevel = client_1.LevelsType.Very_Hard;
        }
        // Check if we need to call AI or can use existing target
        const shouldCallAI = newLevel !== null || !suggestedTarget;
        let responseData;
        if (shouldCallAI) {
            // Only call AI if the level has changed or no suggestedTarget exists
            const message = `Habit Name: ${habitName}
Goal: ${goal}
Current Level: ${newLevel !== null && newLevel !== void 0 ? newLevel : level}`;
            console.log("inside the calling of AI through send message");
            const result = yield aiModel_1.chatSession.sendMessage(message);
            const responseText = yield result.response.text();
            // Parse responseText
            try {
                const jsonString = responseText.replace(/```json\n|\n```/g, "").trim();
                const parsedData = JSON.parse(jsonString);
                // Extract fields from parsed data
                responseData = {
                    habit: parsedData.Habit || habitName,
                    goal: parsedData.Goal || goal,
                    currentLevel: parsedData["Current Level"] || (newLevel !== null && newLevel !== void 0 ? newLevel : level),
                    suggestedTarget: parsedData["Suggested Target"] || "",
                };
                if (!responseData.suggestedTarget) {
                    res.status(500).json({ message: "Suggested target not found in response" });
                    return;
                }
                // Update the habit with new suggestedTarget
                yield db_1.prisma.habit.update({
                    where: { id: habitId },
                    data: Object.assign({ suggestedTarget: responseData.suggestedTarget }, (newLevel ? { level: newLevel, levelUpdatedAt: today } : {})),
                });
            }
            catch (parseError) {
                console.error("Error parsing responseText:", parseError);
                res.status(500).json({ message: "Failed to parse response data" });
                return;
            }
        }
        else {
            // Use existing suggested target if level hasn't changed
            responseData = {
                habit: habitName,
                goal: goal,
                currentLevel: level,
                suggestedTarget: suggestedTarget,
            };
        }
        if (newLevel) {
            res.status(200).json(Object.assign({ message: `Habit level upgraded to ${newLevel}`, level: newLevel, filteredCheckin }, responseData));
        }
        else {
            res.status(200).json(Object.assign({ message: "No level change", level,
                filteredCheckin }, responseData));
        }
    }
    catch (error) {
        console.error("Error in progressiveTarget:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.progressiveTarget = progressiveTarget;
