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
exports.addHabit = void 0;
const db_1 = require("../db/db");
const addHabit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { habitName, description, frequency, duration, expertise, goal, startingTime } = req.body; //TODO 
        if (!habitName || !description || !frequency || !duration || !expertise || !goal || !startingTime) {
            res.status(400).json({ message: "Must fill the required field to add Habit" });
            return;
        }
        const user = req.user;
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        const newHabit = yield db_1.prisma.habit.create({
            data: {
                habitName,
                description,
                userId: user.id,
                streak: 0,
                longestStreak: 0,
                lastCheckIn: null,
                checkInDates: [],
                frequency,
                duration,
                expertiselevel: expertise,
                goal,
                startingTime: startingTime
            },
        });
        res.status(201).json({ message: "Habit added successfully", habit: newHabit });
    }
    catch (error) {
        console.error("Error adding habit:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addHabit = addHabit;
