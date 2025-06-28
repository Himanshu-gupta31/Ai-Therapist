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
exports.QuoteType = void 0;
const db_1 = require("../db/db");
const QuoteType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { habitId } = req.params;
        const user = req.user;
        if (!user) {
            res.status(400).json({ message: "Unauthorized Access" });
            return;
        }
        if (!habitId) {
            res.status(400).json({ message: "Habit ID is required" });
            return;
        }
        const habit = yield db_1.prisma.habit.findUnique({
            where: {
                id: habitId
            }
        });
        const lastCheckIn = (_a = habit === null || habit === void 0 ? void 0 : habit.lastCheckIn) === null || _a === void 0 ? void 0 : _a.toISOString().split("T")[0];
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        if (lastCheckIn !== today) {
            const roastQuotes = yield db_1.prisma.quote.findMany({
                where: {
                    type: "ROAST"
                }
            });
            if (roastQuotes.length === 0) {
                res.status(404).json({ message: "No roast quotes found" });
                return;
            }
            const randomIndex = Math.floor(Math.random() * roastQuotes.length);
            const randomRoast = roastQuotes[randomIndex];
            res.status(200).json({ quote: randomRoast });
            return;
        }
        else {
            const motivationalQuotes = yield db_1.prisma.quote.findMany({
                where: {
                    type: "MOTIVATIONAL"
                }
            });
            if (motivationalQuotes.length === 0) {
                res.status(404).json({ message: "No motivational quotes found" });
                return;
            }
            const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
            const randomRoast = motivationalQuotes[randomIndex];
            res.status(200).json({ quote: randomRoast });
            return;
        }
    }
    catch (error) {
        console.error("Error fetching quote:", error);
        res.status(500).json({ message: "Something went wrong" });
        return;
    }
});
exports.QuoteType = QuoteType;
