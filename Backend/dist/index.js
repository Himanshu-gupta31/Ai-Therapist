"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
// ✅ Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 8000;
// ✅ Apply CORS once and correctly
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true, // Important for cookies, authorization headers
    methods: "GET,POST,PUT,DELETE",
}));
app.use(express_1.default.json({ limit: "20kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use((0, cookie_parser_1.default)());
// Debugging to ensure CORS_ORIGIN is loaded correctly
console.log(`CORS_ORIGIN: ${process.env.CORS_ORIGIN}`);
// Routes Import
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const habitRoute_1 = __importDefault(require("./routes/habitRoute"));
const chatRoute_1 = __importDefault(require("./routes/chatRoute"));
const dailyPlanRoute_1 = __importDefault(require("./routes/dailyPlanRoute"));
const googleRoute_1 = __importDefault(require("./routes/googleRoute"));
const quoteRoute_1 = __importDefault(require("./routes/quoteRoute"));
// Router Declaration
app.get("/", (req, res) => {
    res.send("Welcome to Habit Tracker API");
});
app.use("/api/v1/users", userRouter_1.default);
app.use("/api/v1/habit", habitRoute_1.default);
app.use("/api/v1/chat", chatRoute_1.default);
app.use("/api/v1/daily", dailyPlanRoute_1.default);
app.use("/api/v1/google", googleRoute_1.default);
app.use("/api/v1/quotes", quoteRoute_1.default);
app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`);
});
