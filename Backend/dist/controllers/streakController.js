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
exports.getStreak = exports.updatedStreak = void 0;
const db_1 = require("../db/db");
const updatedStreak = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const habitId = req.params.habitId;
        if (!user) {
            res.status(400).json({ message: "Unauthorized Access" });
            return;
        }
        if (!habitId) {
            res.status(400).json({ message: "Habit ID is required" });
            return;
        }
        const habit = yield db_1.prisma.habit.findUnique({
            where: { id: habitId },
        });
        if (!habit || habit.userId !== user.id) {
            res.status(404).json({ message: "Habit not found" });
            return;
        }
        const now = new Date();
        const todayUTC = now.toISOString().split("T")[0];
        if (habit.checkInDates.includes(todayUTC)) {
            res.status(200).json({
                message: "Already checked in today",
                streak: habit.streak,
                longestStreak: habit.longestStreak,
                checkInDates: habit.checkInDates
            });
            return;
        }
        const sortedDates = [...habit.checkInDates].sort();
        let newStreak = 1;
        if (sortedDates.length > 0) {
            const lastDateStr = sortedDates[sortedDates.length - 1];
            const lastDate = new Date(lastDateStr);
            const today = new Date(todayUTC);
            const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                newStreak = (habit.streak || 1) + 1;
            }
            else if (diffDays > 1) {
                newStreak = 1;
            }
        }
        const updatedCheckInDates = Array.from(new Set([...habit.checkInDates, todayUTC]));
        const updatedHabit = yield db_1.prisma.habit.update({
            where: { id: habit.id },
            data: {
                streak: newStreak,
                longestStreak: Math.max(habit.longestStreak || 0, newStreak),
                lastCheckIn: now,
                checkInDates: { set: updatedCheckInDates },
            },
        });
        res.status(200).json({
            message: "Streak Updated Successfully",
            habitId: updatedHabit.id,
            streak: updatedHabit.streak,
            longestStreak: updatedHabit.longestStreak,
            checkIndates: updatedHabit.checkInDates
        });
    }
    catch (error) {
        console.error("Error updating habit streak:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updatedStreak = updatedStreak;
const getStreak = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            res.status(400).json({ message: "Unauthorized Access" });
            return;
        }
        const now = new Date();
        // console.log(now,"NeW")
        const last7days = new Date(now);
        // console.log(last7days,"1")
        last7days.setUTCDate(now.getUTCDate() - 6);
        // console.log(last7days)
        const get7Days = () => {
            const days = [];
            for (let i = 0; i < 7; i++) {
                const day = new Date(last7days);
                // console.log(day,"Day")
                day.setUTCDate(last7days.getUTCDate() + i);
                const isoDay = day.toISOString().split("T")[0];
                days.push(isoDay);
            }
            return days;
        };
        const last7Dates = get7Days();
        const habits = yield db_1.prisma.habit.findMany({
            where: { userId: user.id },
            select: {
                id: true,
                habitName: true,
                streak: true,
                longestStreak: true,
                lastCheckIn: true,
                checkInDates: true,
            },
        });
        if (!habits || habits.length === 0) {
            res.status(404).json({ message: "No habits found" });
            return;
        }
        const formattedHabits = habits.map((habit) => {
            const checkInDates = habit.checkInDates;
            const last7CheckIns = last7Dates.filter((day) => checkInDates.includes(day));
            return {
                habitId: habit.id,
                habitName: habit.habitName,
                streak: habit.streak,
                longestStreak: habit.longestStreak,
                lastCheckIn: habit.lastCheckIn
                    ? habit.lastCheckIn.toISOString().split("T")[0]
                    : null,
                checkInDates,
                last7CheckInCount: last7CheckIns.length,
                completedDays: last7CheckIns,
            };
        });
        res.status(200).json({ habits: formattedHabits });
    }
    catch (error) {
        console.error("Error fetching streaks:", error);
        res.status(500).json({ message: "Error fetching streaks", error });
    }
});
exports.getStreak = getStreak;
