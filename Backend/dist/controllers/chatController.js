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
exports.handleChat = void 0;
const aiModel_1 = require("../services/aiModel");
const handleChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { habitName, goal } = req.body;
        if (!habitName || !goal) {
            res.status(400).json({ error: "habitName, goal, and expertiseLevel are required" });
            return;
        }
        const message = `Habit Name:${habitName}
    Goal:${goal}
    Suggest a suitable Week 1 habit target.
    `;
        if (!message) {
            res.status(400).json({ error: "Message is required" });
        }
        // Send the message
        const result = yield aiModel_1.chatSession.sendMessage(message);
        // Correct way to get text
        // console.log(result)
        const responseText = yield result.response.text();
        // console.log(responseText)
        res.status(200).json({ response: responseText });
    }
    catch (error) {
        console.error("Error handling chat:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
});
exports.handleChat = handleChat;
