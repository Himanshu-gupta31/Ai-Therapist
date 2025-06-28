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
exports.getHabit = void 0;
const db_1 = require("../db/db");
const getHabit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        const getHabit = yield db_1.prisma.habit.findMany({
            where: {
                userId: user.id
            },
            select: {
                habitName: true,
                description: true,
                id: true,
                frequency: true,
                duration: true,
                goal: true,
                expertiselevel: true
            }
        });
        res.status(200).json({ getHabit });
        return;
    }
    catch (error) {
        console.error("Error fetching habits:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.getHabit = getHabit;
