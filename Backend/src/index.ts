import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Apply CORS once and correctly
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true, // Important for cookies, authorization headers
    methods: "GET,POST,PUT,DELETE",
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Debugging to ensure CORS_ORIGIN is loaded correctly
console.log(`CORS_ORIGIN: ${process.env.CORS_ORIGIN}`);

// Routes Import
import userRouter from "./routes/userRouter";

// Router Declaration
app.use("/api/v1/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running at Port ${PORT}`);
});

export { app };
