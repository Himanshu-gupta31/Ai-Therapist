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
exports.deletePlan = void 0;
const db_1 = require("../db/db");
const deletePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { id } = req.params;
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        const findUser = yield db_1.prisma.user.findUnique({
            where: {
                id: user.id
            }
        });
        const dailyPlan = yield db_1.prisma.dailyPlanner.findUnique({
            where: {
                id: id
            }
        });
        if ((findUser === null || findUser === void 0 ? void 0 : findUser.id) !== (dailyPlan === null || dailyPlan === void 0 ? void 0 : dailyPlan.userId)) {
            res.status(400).json({
                message: "Unauthorized access"
            });
        }
        const deletePlan = yield db_1.prisma.dailyPlanner.delete({
            where: {
                id: id
            }
        });
        res.status(200).json({
            message: "Plan deleted successfully",
            deletePlan
        });
    }
    catch (error) {
        console.error("Error deleting plan:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.deletePlan = deletePlan;
