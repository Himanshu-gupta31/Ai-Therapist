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
exports.addDailyPlan = void 0;
const db_1 = require("../db/db");
const addDailyPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        const { date, planName, startingtime, priority, category, description, endtime } = req.body;
        if (!date || !planName || !startingtime || !priority || !category || !endtime) {
            res.status(402).json({ message: "Required field must be filled" });
            return;
        }
        const addPlan = yield db_1.prisma.dailyPlanner.create({
            data: {
                date: new Date(date),
                description: description,
                planName: planName,
                startingtime: startingtime,
                priority: priority,
                category: category,
                userId: user.id,
                endtime: endtime
            }
        });
        if (!addPlan) {
            res.status(403).json({ message: "Daily Plan failed to add" });
        }
        res.status(200).json({ message: "Daily Plan added succesfully", plan: addPlan });
    }
    catch (error) {
        console.error("Error adding daily plan:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.addDailyPlan = addDailyPlan;
