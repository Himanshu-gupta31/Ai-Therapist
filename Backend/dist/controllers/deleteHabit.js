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
exports.deleteTodo = void 0;
const db_1 = require("../db/db");
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { id } = req.params;
        if (!user || !user.id) {
            res.status(401).json({ message: "Unauthorized access" });
            return;
        }
        const todo = yield db_1.prisma.habit.findUnique({
            where: {
                id: id
            }
        });
        if ((todo === null || todo === void 0 ? void 0 : todo.userId) !== user.id) {
            res.status(400).json({
                message: "Unauthorized access"
            });
        }
        const deletedTodo = yield db_1.prisma.habit.delete({
            where: {
                id: id,
            }
        });
        res.status(200).json({
            message: "Todo deleted successfully",
            deletedTodo
        });
    }
    catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.deleteTodo = deleteTodo;
