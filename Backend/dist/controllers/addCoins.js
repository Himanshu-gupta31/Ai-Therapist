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
exports.addCoins = void 0;
const db_1 = require("../db/db");
const addCoins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const COIN_REWARD = 2;
        const user = req.user;
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        const { habitId } = req.params;
        if (!habitId) {
            res.status(400).json({ message: "Habit ID is required" });
            return;
        }
        const getHabit = yield db_1.prisma.habit.findUnique({
            where: { id: habitId },
            select: { lastCheckIn: true, habitName: true }
        });
        if (!getHabit || !getHabit.lastCheckIn) {
            res.status(404).json({ message: "No habit found or habit not checked in" });
            return;
        }
        const lastCheckedIn = getHabit.lastCheckIn.toISOString().split("T")[0];
        const today = new Date().toISOString().split("T")[0];
        if (lastCheckedIn === today) {
            const alreadyAwarded = yield db_1.prisma.coins.findFirst({
                where: {
                    userId: user.id,
                    habitId: habitId,
                    dateAwarded: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lte: new Date(new Date().setHours(23, 59, 59, 999))
                    }
                }
            });
            if (alreadyAwarded) {
                res.status(409).json({ message: "Coins already awarded today for this habit" });
                return;
            }
            yield db_1.prisma.coins.create({
                data: {
                    userId: user.id,
                    habitId: habitId,
                    amount: COIN_REWARD
                }
            });
            const allCoins = yield db_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    totalCoins: {
                        increment: COIN_REWARD,
                    },
                },
                select: {
                    totalCoins: true,
                    email: true
                }
            });
            res.status(200).json({ message: "Coins added successfully", allCoins });
            return;
        }
    }
    catch (error) {
        console.error("Add coins error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addCoins = addCoins;
